from time import sleep
from flask import Flask, jsonify, request
import functions as func
import sqlite3 as sl
from proxmoxer import ProxmoxAPI
import urllib3
urllib3.disable_warnings()

app = Flask(__name__)


ostemplate = 'local:vztmpl/debian-11-turnkey-wordpress_17.1-1_amd64.tar.gz' #just for the test
cores = 1
storage = 'local'
disk_size = '4'

def create_connection():
    conn = None
    try:
        conn = sl.connect('flask_PFE.db')
        print('Connected to SQLite database')
        return conn
    except sl.Error as e:
        print(e)
    
    return conn

def mark_ip_as_taken(cursor, ip):
    # Update the IP address table to mark the IP address as taken
    cursor.execute('UPDATE IP_LIST SET IS_TAKEN = 1 WHERE IPV4 = ?', (ip,))

def get_new_IP(): #function to get a new IP address
    con = create_connection()
    cur = con.cursor()
    cur.execute("SELECT IPV4 FROM IP_LIST WHERE IS_TAKEN=0")
    result= cur.fetchone()
    if result:
        ip = result[0]  # Get the IP address from the query result
        # Mark the IP address as taken in the table
        cur.execute('UPDATE IP_LIST SET IS_TAKEN = ? WHERE IPV4 = ?', (1,ip,))
        con.commit()
        con.close()
    return ip

def mark_id_as_taken(cursor, id): 
    id=int(id)
    cursor.execute('UPDATE CONTAINER_IDS SET IS_TAKEN = 1 WHERE CONTAINER_ID = ?', (id,))

def get_new_container_ID(): #function to get a new container ID
    con = create_connection()
    cur = con.cursor()
    cur.execute("SELECT CONTAINER_ID FROM CONTAINER_IDS WHERE IS_TAKEN=0")
    result= cur.fetchone()
    if result:
        id = result[0]  # Get the IP address from the query result
        id=int(id)
        # Mark the ID address as taken in the table
        cur.execute('UPDATE CONTAINER_IDS SET IS_TAKEN = ? WHERE CONTAINER_ID = ?', (1,id,))
        con.commit()
        con.close()
    return id

def verify_credentials(username, password):
    conn = create_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM USERS WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()
        print(user)
        if user:
            return True
        else:
            return False
    except sl.Error as e:
        print(e)

    conn.close()

def proxmox_connection():
    proxmox_host = '192.168.150.135:8006'
    proxmox_user = 'root@pam'
    proxmox_password = '123456'

    #establish a connection to the proxmox server
    proxmox = ProxmoxAPI(proxmox_host, user=proxmox_user, password=proxmox_password, verify_ssl=False)

    proxmox.login()
    print("Connection established successfully")
    return proxmox

proxmox = proxmox_connection()

def create_proxmox_container(container_name, container_password, container_type, duree, username):
    # Connect to Proxmox API

    # Calculate container memory based on container type
    if container_type == 'Normal':
        container_memory = 128
    elif container_type == 'Gold':
        container_memory = 256
    elif container_type == 'Platinium':
        container_memory = 512
    else:
        return jsonify(message='Invalid container type'), 400

    # Get a new IP address
    container_ip  = get_new_IP()
    
    #get a new container ID
    container_ID = get_new_container_ID()
    
    # Create the container
    proxmox.nodes('pve1').lxc.create(
            vmid=container_ID,
            hostname=container_name,
            password=container_password,
            ostemplate=ostemplate,
            memory=container_memory,
            cores=cores,
            storage=storage,
            rootfs=disk_size,
            net0="bridge=vmbr0,name=eth0,ip="+container_ip+"/24,gw=192.168.150.135")

    # Save the container details to the database
    connection = create_connection()
    cursor = connection.cursor()

    cursor.execute('INSERT INTO CONTAINER_USER (Container_ID,CONTAINER_NAME, CONTAINER_PASSWORD, USERNAME, Duree, CONTAINER_TYPE) VALUES (?,?, ?, ?, ?,?)',
                   (container_ID,container_name,container_password, username, duree,container_type))

    cursor.execute('INSERT INTO CONTAINER_IP (Container_ID, CONTAINER_IP) VALUES (?, ?)',
                   (container_ID, container_ip))

    connection.commit()
    connection.close()
    
    return jsonify(message='Container created successfully')


@app.route('/api/create-container', methods=['POST'])
def create_container():
    data = request.json
    container_name = data.get('containerName')
    container_password = data.get('password')
    container_type = data.get('containerType')
    duree = data.get('duree')
    username = data.get('username')

    create_proxmox_container(container_name, container_password, container_type, duree, username)
    
    con = create_connection()
    cur = con.cursor()
    
    cur.execute('DELETE FROM CREATE_REQUESTS WHERE USERNAME = ? and TYPE_ABONNEMENT = ? and DUREE = ?', (username, container_type, duree,))
    con.commit()
    con.close()
    # create_proxmox_container(container_name, container_password, container_type, duree, username)

    return jsonify(message='Container created successfully')

@app.route('/api/requests', methods=['GET'])
def get_requests():
    connection = create_connection()
    cursor = connection.cursor()
    
    sql = 'SELECT USERNAME, TYPE_ABONNEMENT, DUREE FROM CREATE_REQUESTS'
    cursor.execute(sql)
    rows = cursor.fetchall()
    
    requests = [{'username': row[0], 'type': row[1], 'duree': row[2]} for row in rows]
    
    connection.close()
    
    return jsonify(requests)

@app.route('/api/Renewrequests', methods=['GET'])
def get_new_requests():
    connection = create_connection()
    cursor = connection.cursor()
    
    sql = 'SELECT USERNAME, CONTAINER_ID, DUREE FROM RENEW_REQUESTS'
    cursor.execute(sql)
    rows = cursor.fetchall()
    
    requests = [{'username': row[0],'container_ID': row[1] ,'duree': row[2]} for row in rows]
    
    connection.close()
    
    return jsonify(requests)



@app.route('/api/create-account', methods=['POST'])
def create_account():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    connection = create_connection()
    cursor = connection.cursor()

    # Insert account information into the database
    try:
        cursor.execute('INSERT INTO USERS (username, password, email) VALUES (?, ?, ?)',
                   (username, password, email))
    except sl.Error as e:
        print("Error user already exists?"+e)
    connection.commit()
    connection.close()

    return jsonify(message='Account created successfully')


@app.route('/api/users', methods=['GET'])
def get_users():
    # Retrieve user data from the database
    connection = create_connection()
    cursor = connection.cursor()

    # Fetch users with their container count
    query = '''
    SELECT users.username, users.password, users.email, COUNT(container_user.username) AS container_count
    FROM USERS
    LEFT JOIN CONTAINER_USER ON users.username = container_user.username
    GROUP BY users.username
    '''
    cursor.execute(query)
    rows = cursor.fetchall()

    # Create a list of dictionaries containing the user data
    user_data = [
        {'username': row[0], 'password': row[1], 'email': row[2], 'container_count': row[3]}
        for row in rows
    ]

    connection.close()

    # Return the data as JSON response
    return jsonify(user_data)


@app.route('/api/update-duree', methods=['POST'])
def update_duree():
    container_id = request.json.get('containerId')
    duree = request.json.get('duree')
    print("we are inside update duree")
    print(container_id, duree)
    # Update duree in the database
    connection = create_connection()
    cursor = connection.cursor()

    query = '''
    UPDATE CONTAINER_USER
    SET duree = duree + ?
    WHERE container_id = ?
    '''
    cursor.execute(query, (duree, container_id))
    
    cursor.execute('DELETE FROM RENEW_REQUESTS WHERE CONTAINER_ID = ?', (container_id,))

    connection.commit()
    connection.close()

    return jsonify({'message': 'Duree updated successfully'})

@app.route('/renew', methods=['POST'])
def handle_renew():
    data = request.json
    container_name = data['containerName']
    renewduree = data['renewDuree'] 
    
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT USERNAME FROM CONECTED_USER WHERE IS_CONECTED = 1")
    result = cursor.fetchone()
    username = result[0]  # Replace with the actual username or get it from user authentication

    cursor.execute("SELECT container_id FROM CONTAINER_USER WHERE container_name = ?", (container_name,))
    resultC = cursor.fetchone()
    container_id = resultC[0]

    # Insert the renew request into the database
    cursor.execute("INSERT INTO renew_requests (username, container_id, duree) VALUES (?, ?, ?)",
                       (username, container_id, renewduree))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Renew request sent successfully'})

@app.route('/container_list', methods=['POST'])
def container_list():
    print("we are inside container list")
    conn = create_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT USERNAME FROM CONECTED_USER WHERE IS_CONECTED = 1")
    result = cursor.fetchone()
    username = result[0]

    # Fetch container list from database
    cursor.execute("SELECT cu.CONTAINER_NAME, ci.container_ip, cu.duree FROM CONTAINER_USER cu JOIN CONTAINER_IP ci ON cu.container_id = ci.container_id WHERE cu.username = ?",
                      (username,))
    container_list = cursor.fetchall()

    # Convert container list to JSON format
    result = []
    for container in container_list:
        container_data = {
            'container_name': container[0],
            'container_ip': container[1],
            'duree': container[2]
        }
        result.append(container_data)
    conn.close()
    return jsonify(result)

@app.route('/USERcontainers', methods=['POST'])
def get_user_containers():
    # Query to fetch connected username
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT USERNAME FROM CONECTED_USER WHERE IS_CONECTED = 1")
    connected_username=cursor.fetchone()[0]

    # Query to fetch container data
    query = """
        SELECT cu.container_name, cu.container_type, ci.container_IP
        FROM CONTAINER_USER cu
        INNER JOIN container_IP ci ON cu.container_ID = ci.container_ID
        WHERE cu.username = ?
    """

    # Fetch data from the database
    cursor.execute(query, (connected_username,))
    result = cursor.fetchall()

    # Prepare the response
    containers = []
    for row in result:
        container = {
            'container_name': row[0],
            'container_type': row[1],
            'container_IP': row[2]
        }
        containers.append(container)
    # Return the container data as a JSON response
    return jsonify(containers)

@app.route('/User-turn-on-container', methods=['POST'])
def turn_on_Usercontainer():
    container_name = request.json['container_name']
    proxmox = proxmox_connection()
    conn = create_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT container_ID FROM CONTAINER_USER WHERE container_name = ?", (container_name,))
    container_id = cur.fetchone()[0]
    proxmox.nodes('pve1').lxc(container_id).status.start.post()
    conn.close()
    return jsonify({'message': 'Container turned up successfully'})

@app.route('/User-turn-off-container', methods=['POST'])
def turn_off_Usercontainer():
    container_name = request.json['container_name']
    proxmox = proxmox_connection()
    conn = create_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT container_ID FROM CONTAINER_USER WHERE container_name = ?", (container_name,))
    container_id = cur.fetchone()[0]
    proxmox.nodes('pve1').lxc(container_id).status.shutdown.post()
    conn.close()
    return jsonify({'message': 'Container turned off successfully'})

@app.route('/api/containers')
def get_containers():
    try:
        conn = create_connection()
        cursor = conn.cursor()

        # Fetch container data and IP address in a single query
        cursor.execute("""
            SELECT cu.container_ID, cu.Duree, cu.Username, ci.container_IP
            FROM CONTAINER_USER cu
            JOIN CONTAINER_IP ci ON cu.container_ID = ci.container_ID
        """)
        container_data = cursor.fetchall()

        container_list = []
        for container in container_data:
            container_id = container[0]
            duree = container[1]
            username = container[2]
            ip_address = container[3]

            container_list.append({
                'container_ID': container_id,
                'Duree': duree,
                'Username': username,
                'container_IP': ip_address
            })
        conn.close()
        return jsonify(container_list)

    except sl.Error as e:
        return jsonify({'error': str(e)})


@app.route('/api/container/turnup', methods=['POST'])
def turn_up_container():
    container_id = request.json.get('containerId')
    proxmox.nodes('pve1').lxc(container_id).status.start.post()

    return jsonify({'message': 'Container turned up successfully'})

@app.route('/api/container/shutdown', methods=['POST'])
def shutdown_container():
    container_id = request.json.get('containerId')
    proxmox.nodes('pve1').lxc(container_id).status.shutdown.post()

    return jsonify({'message': 'Container shutdown successfully'})

@app.route('/api/container/reboot', methods=['POST'])
def reboot_container():
    container_id = request.json.get('containerId')
    proxmox.nodes('pve1').lxc(container_id).status.reboot.post()

    return jsonify({'message': 'Container rebooted successfully'})

@app.route('/api/container/delete', methods=['POST'])
def delete_container():
    container_id = request.json.get('containerId')
    proxmox.nodes('pve1').lxc(container_id).delete()
    
    conn = create_connection()
    cursor = conn.cursor()

        # Delete row from CONTAINER_USER
    cursor.execute("UPDATE IP_LIST SET IS_TAKEN = 0 WHERE IPV4 = (SELECT container_IP FROM CONTAINER_IP WHERE container_ID = ?)", (container_id,))
    cursor.execute("UPDATE CONTAINER_IDS SET IS_TAKEN = 0 WHERE container_ID = ?", (container_id,))
    
    cursor.execute("DELETE FROM CONTAINER_USER WHERE container_ID = ?", (container_id,)) 
    cursor.execute("DELETE FROM CONTAINER_IP WHERE container_ID = ?", (container_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Container deleted successfully'})


@app.route('/create_request', methods=['POST'])
def create_request():
    conn = create_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT USERNAME FROM CONECTED_USER WHERE IS_CONECTED = 1")
    result = cursor.fetchone()
    username = result[0]
    subscription_type = request.json['type']
    duree = request.json['duree']

    # Insert into CREATE_REQUEST table
    cursor.execute("INSERT INTO CREATE_REQUESTS (USERNAME, TYPE_ABONNEMENT, DUREE) VALUES (?, ?, ?)",
                       (username, subscription_type, int(duree)))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Request created successfully'})

# Route to handle logout
@app.route('/logout', methods=['POST'])
def logout():
    # Delete from CONNECTED_USER table where IS_CONNECTED = 1
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM CONECTED_USER WHERE IS_CONECTED = 1")
    conn.commit()
    conn.close()
    return jsonify({'message': 'Logged out successfully'})


#API Route
@app.route('/api/login', methods=['POST'])  #LOGIN API
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    print(username, password)

    if verify_credentials(username, password):
        con = create_connection()
        cur = con.cursor()
        cur.execute("INSERT INTO CONECTED_USER (USERNAME, IS_CONECTED) VALUES (?, ?)", (username, 1))
        con.commit()
        con.close()
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'error': 'Invalid credentials'})


if __name__ == '__main__':
    app.run(debug=True)