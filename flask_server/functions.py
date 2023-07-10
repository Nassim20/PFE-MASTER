from time import sleep
from proxmoxer import ProxmoxAPI
import urllib3
import sqlite3 as sl
urllib3.disable_warnings()

#------------------------Database Connection---------------


con = sl.connect('flask_PFE.db')
cur = con.cursor()


#------------------------- Connection--------------------------
#Turn it into a function later to put it only when the admin logs in
#proxmox server configuration

def proxmox_connection():
    proxmox_host = '192.168.150.135:8006'
    proxmox_user = 'root@pam'
    proxmox_password = '123456'

    #establish a connection to the proxmox server
    proxmox = ProxmoxAPI(proxmox_host, user=proxmox_user, password=proxmox_password, verify_ssl=False)

    proxmox.login()
    print("Connection established successfully")
    return proxmox
#----------------------------------------------------------------

#Temporary Username and password

username = ""
username_password = ""


# Liste des containers    
    


# container configuration later will become automatic =====> to input/switch
password = '123456'
memory = 128
ostemplate = 'local:vztmpl/debian-11-standard_11.6-1_amd64.tar.zst' #just for the test
cores = 1
storage = 'local'
disk_size = '1'

abonnement_type = '' # 'Premium' or 'Gold' or 'Basic'

#option_id = 0 # 1 for create, 2 for delete options

 

def select_abonnement(abonnement_type): # set variables according to the abonnement type
    if abonnement_type == 'Premium':
        memory = 512
        print('Premium selected')
    elif abonnement_type == 'Gold':
        memory = 256
        print('Gold selected')
    elif abonnement_type == 'Normal':
        memory = 128
        print('Normal selected')
    else:
        print('Invalid abonnement type')
        select_abonnement(input('Enter the abonnement type: '))


# create a container

def create_container(ct_id):
    proxmox=proxmox_connection()
    hostname = 'container'+str(ct_id)
    ct_ip = get_new_IP()
    input_abonnement = input('Enter the abonnement type: ') # choose abonnement type
    select_abonnement(input_abonnement)
    #creation of the container
    proxmox.nodes('pve1').lxc.create(
            vmid=ct_id,
            hostname=hostname,
            password=password,
            ostemplate=ostemplate,
            memory=memory,
            cores=cores,
            storage=storage,
            rootfs=disk_size,
            net0="name=eth0,ip="+ct_ip+"/24,gw=192.168.150.135"
        )
    print("Wait a moment please...")
    sleep(10)
    print("Container created successfully")
    cur.execute("")
    return ct_id
    
# Set/ADD the container and its IP4 address in the DB table

def container_and_IP(ct_id,ct_ip):
    cur.execute("UPDATE TABLE CONTAINER_IP SET ct_ip=? WHERE ct_id=?",(ct_ip,ct_id))
    
    
# Modify the availability of the IP address

def change_IP_Unavailable(ct_ipv4):
    cur.execute("UPDATE TABLE IP_LIST SET IS_TAKEN=1 WHERE IPV4=?",(ct_ipv4,))

def change_IP_available(ct_ipv4):
    cur.execute("UPDATE TABLE IP_LIST SET IS_TAKEN=0 WHERE IPV4=?",(ct_ipv4,))
    

# Adding the container and its USER to the table

def add_user_container(username,ct_id):
    cur.execute("INSERT INTO CONTAINER_USER (username, container_ID) values(?, ?)", (username, ct_id))


# Deletion of a container

def delete_container():
    proxmox=proxmox_connection()
    ct_id = input('Enter the container id to delete: ')
    proxmox.nodes('pve1').lxc(ct_id).status.shutdown.post()
    proxmox.nodes('pve1').lxc(ct_id).delete()
    print("Container deleted successfully")


#Functions to turnup and shutdow or reboot containers

def turnup_container(ct_id):
    proxmox=proxmox_connection()
    #ct_id = (int)(input('Enter the container id to turnup: '))
    proxmox.nodes('pve1').lxc(ct_id).status.start.post()
    print("Container turned up successfully")
    
def shutdown_container(ct_id):
    proxmox=proxmox_connection()
    #ct_id = (int)(input('Enter the container id to shutdown: '))
    proxmox.nodes('pve1').lxc(ct_id).status.shutdown.post()
    print("Container shutdown successfully")
    
def reboot_container(ct_id):
    proxmox=proxmox_connection()
    #ct_id = (int)(input('Enter the container id to reboot: '))
    proxmox.nodes('pve1').lxc(ct_id).status.reboot.post()
    print("Container rebooted successfully")
    
def container_actions(): # choosing container action 1 for turnning up 2 for shutdown 3 for reboot
    ct_id = (int)(input('Choose a container ID:'))
    action_id = (int)(input('Enter the container action: 1 for turnup, 2 for shutdown, 3 for reboot : '))
    if action_id == 1:
        turnup_container(ct_id)
    elif action_id == 2:
        shutdown_container(ct_id)
    elif action_id == 3:
        reboot_container(ct_id)



def container_view_IP(ct_id): # with Container IP Address
    proxmox=proxmox_connection()
    container = proxmox.nodes('pve1').lxc(ct_id)
    ip_address = container.config.get()['net0']
    #print Container ID and IP
    print("Container "+ct_id+" with IP Address {"+ip_address+"}")

#User creation and auth

def create_user():
    username = input('Enter the username: ')
    password = input('Enter the password: ')
    email = input('Enter the email: ')
    #proxmox.access.users.create(userid=username, comment=username, password=password, email=email)
    #insert the user into the database
    cur.execute('INSERT INTO USERS (username, password, email) values(?, ?, ?)', (username, password, email))
    
    
    
def auth_user(username, password):
    #check if the user exists in the database
    cur.execute('SELECT * FROM USERS WHERE username=? AND password=?', (username, password))
    user = cur.fetchone()
    if user:
        print("User authenticated successfully")
        return True
    else:
        print("User not found")
        return False

def user_login():
    global username
    global username_password
    username = input("please enter your username : ")
    username_password = input("please enter your password : ")
    if auth_user(username,username_password):
        print("user login successfully")
    else:
        print("Wrong password try again")
        user_login()
    

def user_containers(username): #For the user to see his containers
    container_list = cur.execute('SELECT container_ID FROM CONTAINER_USER WHERE username=?', (username,))
    return container_list.fetchall()


def user_containers_info(username): # with Container IP Address
    proxmox=proxmox_connection()
    container_list = user_containers(username)
    for container in container_list:
        container_info = proxmox.nodes('pve1').lxc(container[0]).status.current.get()
        print("\t ID : {0}. name : {1} => current status : {2} => IP Address : {3}".format(container_info['vmid'], container_info['name'], container_info['status'], cur.execute('SELECT container_IP FROM CONTAINER_IP WHERE container_ID=?', (container_info['vmid'],)).fetchone()[0]))

#----------------------------------------TEST---------------------------------


# choosing command option

def command_option(option_ids):
    if option_ids == 1:
        ct_id = input('Enter the container id: ')
        ct_ip = input('Enter the container IP Address/CIDR: ')
        ##container_IP = input('Enter the container IP Address/CIDR: ')
        create_container(ct_id,ct_ip)
    elif option_ids == 2:
        delete_container()
    elif option_ids == 3:
        proxmox=proxmox_connection()
        vms = proxmox.nodes('pve1').lxc.get() # get all containers
        for container in vms:
            print("\t ID : {0}. name : {1} => current status : {2}".format(container['vmid'], container['name'], container['status']))
        
        
# Fetch a new IP Address

def get_new_IP(): #function to get a new IP address
    ip = cur.execute("SELECT IPV4 FROM IP_LIST WHERE IS_TAKEN=0")
    return ip.fetchone

# Give container to a USER (assigning it to a user in the Database)

def give_container_to_user(username):
    username = input('')
        
        
#----------------------------------------TEST---------------------------------  
        

# for container in proxmox.nodes('pve1').lxc.get():       #to see running and stopped containers
#     print("\t{0}. {1} => {2}".format(container['vmid'], container['name'], container['status']))
    
#option_id = (int)(input('Enter the command option: 1 for create, 2 for delete , 3 for containers information : '))
#command_option(option_id)





