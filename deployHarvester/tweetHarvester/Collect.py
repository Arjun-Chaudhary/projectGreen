import tweepy
from tweepy import OAuthHandler
from twitter_login import tweepy_authentication
from couchdb_login import couch_login
import time
import configparser
import sys



def limit_handled(cursor):
    while True:
        try:
            yield cursor.next()
        except tweepy.RateLimitError:
            print('waiting')
            time.sleep(15 * 60)

def insert_DB(db, id, isProcessed):
  
    doc = db.get(id)
    if doc is None:
        user = api.get_user(id)
        geo_enabled = user.geo_enabled
        location = user.location
        print(geo_enabled)
        print(location)
        db_handles[str(id)]={'status': isProcessed, 'geo_enabled': geo_enabled,'location': location}
def get_batchNum(db):
    #This portion gets the number of seed handles from the view
    for id in db.iterview('unique/handles', 2000, None):
        toCollect = id.value
    return toCollect

def harvestUsers(api_list, db_handles):
    
    api_num = len(api_list)
    api_index = 0
    api = api_list[api_index]

    for id in db_handles:
        doc = db_handles.get(id)
        
        try:
            for follower in limit_handled(tweepy.Cursor(api.followers_ids, user_id = doc.id).items()):
                #To check the follower's id is in database or not
                doc = db_handles.get(str(follower))
                if doc is None:
                    db_handles[str(follower)]={'status': False}
                else:
                    print('User has been added already, process the next one')
                   
        except tweepy.RateLimitError as e:
            print(e)
            if api_index > api_num - 1:
                print('Exhaust the list of api_list, waiting for 15 mins')
                time.sleep(15 * 60)
                #reset from start of api list
                api_index = 0
            else:
                print('Adding follower RateLimitError, try another credential')
                api_index += 1
                api = api_list[api_index]

        except tweepy.error.TweepError as e:
            print(e)
            if api_index > api_num - 1:
                print('Exhaust the list of api_list, waiting for 15 mins')
                time.sleep(15 * 60)
                #reset from start of api list
                api_index = 0
            else:
                print('Adding follower RateLimitError, try another credential')
                api_index += 1
                api = api_list[api_index]

def harvestTweets(api_list, db_handles, db_tweets):
    for id in db_handles:
        doc = db_handles.get(str(id))
        status = doc['status']
        api_num = len(api_list)
        api_index = 0
        api = api_list[api_index]
        if status == False:
            #Mark as processed
            print('mark as processed')
            doc['status'] = True
            db_handles.save(doc)
            try:
                for tweet in limit_handled(tweepy.Cursor(api.user_timeline, id = doc.id,count = '3000').items()):
                   

                    doc = db_tweets.get(tweet.id_str)
                    if doc is None:
                        
                        db_tweets[tweet.id_str] = tweet._json
                    else:
                        print('This tweet has been added')

            except tweepy.RateLimitError as e:
                print(e)
                if api_index > api_num - 1:
                    print('Exhaust the list of api_list, waiting for 15 mins')
                    time.sleep(15 * 60)
                    #reset from start of api list
                    api_index = 0
                else:
                    print('Adding follower RateLimitError, try another credential')
                    api_index += 1
                    api = api_list[api_index]

            except tweepy.error.TweepError as e:
                print(e)
                if api_index > api_num - 1:
                    print('Exhaust the list of api_list, waiting for 15 mins')
                    time.sleep(15 * 60)
                    #reset from start of api list
                    api_index = 0
                else:
                    print('Adding follower RateLimitError, try another credential')
                    api_index += 1
                    api = api_list[api_index]

def getSeedUsers(db_seeds, db_handles):
    try:
        for id in db_seeds:

            doc = db_seeds.get(id)
            user_id = doc['user']['id']
            geo_enabled = doc['user']['geo_enabled']
            location = doc['user']['location']
            isProcessed = False

            doc = db_handles.get(str(user_id))

            if doc is None:
                db_handles[str(user_id)]={'status': isProcessed, 'geo_enabled': geo_enabled,'location': location}
         
    except KeyError:
        print('last item in the row')

def main(argv):

    config = configparser.RawConfigParser()
    config.read('conf.cfg')
    db_seeds = couch_login(config,'seeds')
    db_tweets = couch_login(config,'tweets')
    db_handles = couch_login(config,'handles')
    api_list = tweepy_authentication(config)


    
    if int(argv[0]) == 1:
        print('Harvesting users')
        while True:
            if not api_list:
                print('API List is empty')
            else:
                harvestUsers(api_list, db_handles)
            

    elif int(argv[0]) == 2:
        print('Harvesting tweets')
        while True:
            if not api_list:
                print('API List is empty')
            else:
                harvestTweets(api_list, db_handles, db_tweets)

    elif int(argv[0]) == 3:
        getSeedUsers(db_seeds, db_handles)
    else:
        print('Usage: python <filename> options \n 1 - harvestUsers \n 2 - harvestTweets \n 3 - getSeedUsers')
    
    
    

if __name__ == "__main__":
   main(sys.argv[1:])








