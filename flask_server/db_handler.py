import sqlite3 as sl


con = sl.connect('flask_PFE.db')
cur = con.cursor()


with con:
    con.execute("""
                CREATE TABLE IF NOT EXISTS USERS(
                    id INTEGER NOT NULL  PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    email TEXT NOT NULL
                );
                """)
        
    
cur.execute("""
            CREATE TABLE IF NOT EXISTS CONTAINER_USER (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                CONTAINER_ID integer NOT NULL UNIQUE,
                CONTAINER_NAME TEXT NOT NULL UNIQUE,
                CONTAINER_PASSWORD TEXT NOT NULL,
                USERNAME TEXT NOT NULL,
                DUREE integer NOT NULL,
                CONTAINER_TYPE TEXT NOT NULL
                );
            """)


cur.execute("""
            CREATE TABLE IF NOT EXISTS CONTAINER_IP(
                container_ID integer NOT NULL primary key,
                container_IP TEXT NOT NULL UNIQUE
                
            )
            """
)


cur.execute("""
            CREATE TABLE IF NOT EXISTS IP_LIST(
                IPV4 TEXT NOT NULL primary key,
                IS_TAKEN integer NOT NULL check(IS_TAKEN in (0,1))
            )
            """
)

cur.execute("""
            CREATE TABLE IF NOT EXISTS CONTAINER_IDS(
                CONTAINER_ID integer NOT NULL primary key,
                IS_TAKEN integer NOT NULL check(IS_TAKEN in (0,1))
                )
            """)


cur.execute("""CREATE TABLE IF NOT EXISTS CREATE_REQUESTS(
    request_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    USERNAME TEXT NOT NULL,
    TYPE_ABONNEMENT TEXT NOT NULL,
    DUREE INTEGER NOT NULL
)
""")

# cur.execute('insert into CREATE_REQUESTS (USERNAME, TYPE_ABONNEMENT, DUREE) values(?, ?, ?)', ('Nassim', 'Normal', '30'))

cur.execute("""CREATE TABLE IF NOT EXISTS RENEW_REQUESTS(
    request_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    USERNAME TEXT NOT NULL,
    CONTAINER_ID INTEGER NOT NULL,
    DUREE INTEGER NOT NULL
)
""")


cur.execute("""CREATE TABLE IF NOT EXISTS CONECTED_USER(
    USERNAME TEXT NOT NULL PRIMARY KEY,
    IS_CONECTED INTEGER DEFAULT 0 CHECK(IS_CONECTED IN (0,1))
    )
""")


# query = """
#         SELECT container_name, container_type, container_IP
#         FROM CONTAINER_USER cu
#         INNER JOIN container_IP ci ON cu.container_ID = ci.container_ID
#         WHERE cu.username = ?
#     """

    # Fetch data from the database
# cur.execute(query, ('nassim',))
# rows = cur.fetchall()
# print(rows)

# cur.execute('insert into RENEW_REQUESTS (USERNAME, DUREE) values(?, ?)', ('Nassim', '30'))

# cur.execute('drop table CREATE_REQUESTS')
# cur.execute('drop table RENEW_REQUESTS')

# sql = 'INSERT INTO IP_LIST (IPV4, IS_TAKEN) values(?, ?)'
# data = [
#    ('192.168.1.1', '0'),
#    ('192.168.1.2', '0'),
#    ('192.168.1.3', '0'),
#    ('192.168.1.4', '0'),
#    ('192.168.1.5', '0'),
#    ('192.168.1.6', '0'),
#    ('192.168.1.7', '0'),
#    ('192.168.1.8', '0'),
# ]



# sql = 'INSERT INTO CONTAINER_IDS (CONTAINER_ID, IS_TAKEN) values(?, ?)'
# data = [
#     (100, '0'),
#     (101, '0'),
#     (102, '0'),
#     (103, '0'),
#     (104, '0'),
#     (105, '0'),
#     (106, '0'),
#     (107, '0'),
#     (108, '0'),
# ]



# cur.executemany(sql, data)


# cur.execute('UPDATE IP_LIST SET IS_TAKEN = 1 WHERE IPV4 = ?', ('192.168.1.1',))

# cur.execute('UPDATE CONTAINER_IDS SET IS_TAKEN = 1 WHERE CONTAINER_ID = ?', (100,))

#res_users = cur.execute('SELECT * FROM USERS')
#print(res_users.fetchall())

# cur.execute('INSERT INTO USERS (username, password, email) values(?, ?, ?)', ('admin', '123456', 'admin@gmail'))

# res = cur.execute('SELECT * FROM CONTAINER_IP')
# print(res.fetchall())

# cur.execute("drop table if exists CONTAINER_USER")
# cur.execute("drop table if exists CONTAINER_IP")


# cur.execute("SELECT cu.CONTAINER_NAME, ci.container_ip, cu.duree FROM CONTAINER_USER cu JOIN CONTAINER_IP ci ON cu.container_id = ci.container_id WHERE cu.username = ?",
#                        ('nassim',))

# result = cur.fetchall()
# print (result)


# cur.execute("delete from users")
# cur.execute("DELETE FROM CONTAINER_USER")
# cur.execute("DELETE FROM CONTAINER_IP")
# cur.execute("DELETE FROM IP_LIST")
# cur.execute("DELETE FROM CONTAINER_IDS")
# cur.execute("DELETE FROM RENEW_REQUESTS")

# query = '''
#     UPDATE CONTAINER_USER SET duree = duree + ? WHERE container_id = ?
#     '''
# cur.execute(query, (30, 100))

# cur.execute('DELETE FROM RENEW_REQUESTS WHERE CONTAINER_ID = ?', (101,))

cur.execute('DELETE FROM CREATE_REQUESTS WHERE USERNAME = ? and TYPE_ABONNEMENT = ? and DUREE = ?', ('nassim', 'Platinium', 30,))

con.commit()
con.close()