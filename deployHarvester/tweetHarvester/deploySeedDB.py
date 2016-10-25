
# coding: utf-8

# In[6]:

# This block of code upto sys.exit(-1)
# answers the question Could we query at a rate faster than 18K tweets/15 mins ?
import tweepy

# Below function takes API_KEY and API_SECRET as arguments.
# We are using AppAuthHandler rather than frequently used OAuthHandler because former sets up app only Auth and 
# provide higher limits. 
auth = tweepy.AppAuthHandler('2wiCvpRgCUIXqsBSUVuiz7ah7', 'JNPFoGr8GBnok6m7Kc3X4UiqEJ5F6eWoVNwbDOtAM4YEGOVdwV')

# wait_on_rate_limit and wait_on_rate_limit_notify are set to true which allow Tweepy API call auto wait (sleep) once rate limit
# is reached and then continue when the required window gets expired and hence you dont have to do it manually.
api = tweepy.API(auth, wait_on_rate_limit=True,wait_on_rate_limit_notify=True)

# simple if loop which test above api variable.
if (not api):
    print ("We are unable to authenticate the given credentials. Please check and come back later")
    sys.exit(-1)


# In[26]:

# This block of code upto print ("We have downloaded {0} tweets, and saved to couchdb database named {1}".format(tweetCount, fName))
# answers the question Could we maintain a search context across our API rate limit window, so as to 
# avoid getting duplicate results when searching repeatedly over a long period of time ?
# because twitter api is a stateless machine hence doesnt keep track what data it has sent to you so you have to tell it
# upto where you have recieved and from where you require so for taht we used sinceId  and max_id and 
# covered all cases in if else condition.

import sys
import jsonpickle
import os
import couchdb
import subprocess


def deployView():
    print('deploy seed view')

    status_code = subprocess.call(['curl', '-X', 'PUT', 'http://umer:umer@localhost:5984/umerstest/_design/unique', '-d', '@unique.json'])
            
    if status_code != 0:
        sys.exit(1)

    print('deployView Done')
def deployView(hostname):
    print('deploy seed view')

    status_code = subprocess.call(['curl', '-X', 'PUT', 'http://umer:umer@' +hostname + ':5984/family_data/_design/view', '-d', '@view.json'])
            
    if status_code != 0:
        sys.exit(1)

    status_code = subprocess.call(['curl', '-X', 'PUT', 'http://umer:umer@' +hostname + ':5984/block_income/_design/incomeView', '-d', '@incomeView.json'])
            
    if status_code != 0:
        sys.exit(1)

    status_code = subprocess.call(['curl', '-X', 'PUT', 'http://umer:umer@' +hostname + ':5984/tweets/_design/hasCoordinate', '-d', '@hasCoordinate.json'])
            
    if status_code != 0:
        sys.exit(1)

    print('deployView Done')

def deployFamilyDataDB():
      # global server
    COUCH_SERVER ='http://localhost:5984/'
    # Always remeber dont write capital letter for couch database name.
    COUCH_DATABASE = 'family_data'
    server = couchdb.Server(COUCH_SERVER)
    server.resource.credentials=("umer", "umer")

    try:        
        # if db already exist then catch error and store in it 
        db = server.create(COUCH_DATABASE)
        print ("creating db",db)    

        
    except couchdb.http.PreconditionFailed:
        #url used for accessing couchDB server 
       db =server[COUCH_DATABASE]    
    '''couchdb'''

def deployIncomeDB():
      # global server
    COUCH_SERVER ='http://localhost:5984/'
    # Always remeber dont write capital letter for couch database name.
    COUCH_DATABASE = 'block_income'
    server = couchdb.Server(COUCH_SERVER)
    server.resource.credentials=("umer", "umer")

    try:        
        # if db already exist then catch error and store in it 
        db = server.create(COUCH_DATABASE)
        print ("creating db",db)    

        
    except couchdb.http.PreconditionFailed:
        #url used for accessing couchDB server 
       db =server[COUCH_DATABASE]    
    '''couchdb'''
def deployTweetsDB():
      # global server
    COUCH_SERVER ='http://localhost:5984/'
    # Always remeber dont write capital letter for couch database name.
    COUCH_DATABASE = 'tweets'
    server = couchdb.Server(COUCH_SERVER)
    server.resource.credentials=("umer", "umer")

    try:        
        # if db already exist then catch error and store in it 
        db = server.create(COUCH_DATABASE)
        print ("creating db",db)    

        
    except couchdb.http.PreconditionFailed:
        #url used for accessing couchDB server 
       db =server[COUCH_DATABASE]    
    '''couchdb'''

def deployHandlesDB():
      # global server
    COUCH_SERVER ='http://localhost:5984/'
    # Always remeber dont write capital letter for couch database name.
    COUCH_DATABASE = 'handles'
    server = couchdb.Server(COUCH_SERVER)
    server.resource.credentials=("umer", "umer")

    try:        
        # if db already exist then catch error and store in it 
        db = server.create(COUCH_DATABASE)
        print ("creating db",db)    

        
    except couchdb.http.PreconditionFailed:
        #url used for accessing couchDB server 
       db =server[COUCH_DATABASE]    
    '''couchdb'''

def deploySeedDB():

    '''couchdb'''
    # global server
    COUCH_SERVER ='http://localhost:5984/'
    # Always remeber dont write capital letter for couch database name.
    COUCH_DATABASE = 'umerstest'
    server = couchdb.Server(COUCH_SERVER)
    server.resource.credentials=("umer", "umer")

    try:        
        # if db already exist then catch error and store in it 
        db = server.create(COUCH_DATABASE)
        print ("creating db",db)    

        
    except couchdb.http.PreconditionFailed:
        #url used for accessing couchDB server 
       db =server[COUCH_DATABASE]    
    '''couchdb'''

    searchString = '#someHashtag'  # provide the hashtag you want to search
    maxTweetLimit = 100# just give random large number
    numberOfTweetsPerQry = 100  # API limit enforced by twitter



    # If outcome from a specific ID onwards are essential, set sinceId  to that ID.
    # else set to NONE i.e. go in past as far as API allows there is no limit, 
    sinceId  = None
     
    # If outcome upto a specific ID are essential, set max_id to that ID.
    # else default to big number which indicates no upper limit.
    max_id = -1
    tweetCount = 0

    # below is a format method so in simple terms {0} will be replaced with maxTweetLimit i.e. 10000000
    print("Downloading max {0} tweets".format(maxTweetLimit))

        # So upto 10000000
    while tweetCount < maxTweetLimit:
        try:
            # so if no upperlimit go and extract as much you can else extract tweets upto upper bound
            if (max_id <= 0):
                # if no lower limit is set then all tweets else tweet only after given id 
                # lat long are of Lerderderg VIC West-North far point
                if (not sinceId ):
                    new_tweets = api.search(geocode="-37.459418,144.405192,70km", count=numberOfTweetsPerQry)
                else:
                    new_tweets = api.search(geocode="-37.459418,144.405192,70km", count=numberOfTweetsPerQry,
                                                sinceId =sinceId )
            else:
                # if no lower limit is set then all tweets upto upperbound else tweet between given ids
                if (not sinceId ):
                    print ("inside")
                    new_tweets = api.search(geocode="-37.459418,144.405192,70km", count=numberOfTweetsPerQry,
                                                max_id=str(max_id - 1))
                else:
                    new_tweets = api.search(geocode="-37.459418,144.405192,70km", count=numberOfTweetsPerQry,
                                                max_id=str(max_id - 1),
                                                sinceId =sinceId )
            #checking whether above new_tweets variable contains some tweet or not if not then break else write in the file
            if not new_tweets:
                print("We cant find more tweets. Please come after sometime")
                break
            for tweet in new_tweets:
                # if tweet dont exist in db add it.
                if tweet.id_str not in db:
                    db[tweet.id_str] = tweet._json
                #else:
                    # using twitter given id which is uique for storage    
                #   db[tweet.id_str] = tweet._json
            tweetCount += len(new_tweets)
            print("Suucesfully extracted {0} tweets".format(tweetCount))
            max_id = new_tweets[-1].id
            print (max_id)
        except tweepy.TweepError as e:
            # Just exit if any error
            print("tweepy is experiencing some errors : " + str(e))
            break

    print ("We have downloaded {0} tweets, and saved to couchdb database named {1}".format(tweetCount, COUCH_DATABASE))

def main(argv):
    deployHandlesDB()
    deployTweetsDB()
    deployIncomeDB()
    deployFamilyDataDB()
    deploySeedDB()

if __name__ == "__main__":
   main(sys.argv[1:])
#Each line of the file is a tweet encoded in JSON format. And all tweets are in reversed order of the creation timestamp 
#i.e. going from most recent to most farthest. 
#millions of tweets can be downloaded at the optimal 
#rate of 45K tweets/15-mins. Above code san be run as daemon and it will aloow you to download all tweets of past till all
#tweets has been exhausted.


# In[ ]:

# This block of code upto sys.exit(-1)
# answers the question Could we do something about the fact that not all tweets matching the search criteria will be 
#returned by the API ?

#The idea is that; Of the tweets you have fetched there will be quite a lot of retweets, and 
#chances are that some of the original tweets of these retweets are not in the results downloaded.
#But each retweet also encodes the entire original tweet object in its JSON representation. 
#So if we pick out these original tweets from retweets then we can augment our results by including the missing original
#tweets in the result set. We can easily do this as each tweet is assigned a unique ID,
#thus allowing us to use set functions to pick out only the missing tweets.

#For extracting the missing original tweets from retweets, think of the following pseudo-code.
#Store all downloaded tweets in a set (say set A)
#From this set filter out the retweets & extract the original tweet from these retweets (say set B)
#Insert in set A all unique tweets from set B that are not already in set A

