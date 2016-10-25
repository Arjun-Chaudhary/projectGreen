
import couchdb


def couch_login(config,entity):
    #COUCH_SERVER ='http://115.146.95.194:5984/'
    COUCH_SERVER =config.get('database','COUCH_SERVER')
    # Always remeber dont write capital letter for couch database name.
    if entity == 'tweets':
        COUCH_DATABASE = config.get('database','COUCH_DATABASE_TWEETS')
    elif entity == 'handles':
        COUCH_DATABASE = config.get('database', 'COUCH_DATABASE_HANDLES')
    elif entity == 'seeds':
        COUCH_DATABASE = config.get('database', 'COUCH_DATABASE_SEEDS')
    server = couchdb.Server(COUCH_SERVER)
    server.resource.credentials=(config.get('database','COUCH_LOGIN_USERNAME'), config.get('database','COUCH_LOGIN_PASSWORD'))
    try:
            #url used for accessing couchDB server
        db = server.create(COUCH_DATABASE)
        print ("creating db",db)


    except couchdb.http.PreconditionFailed:
    # if db already exist then catch error and store in it
        db =server[COUCH_DATABASE]
    return db
		 

'''couchdb'''