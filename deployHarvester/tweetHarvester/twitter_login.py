# This block of code answers the question Could we query at a rate faster than 18K tweets/15 mins ?

import tweepy
import sys
import jsonpickle
import os
import couchdb

def tweepy_authentication(config):
    """The config file should contain:

    [auth]
    API_KEY = ...
    API_SECRET = ...
    """
    API_KEY_NUM = config.get('auth_key_num','API_TOKEN_NUM')
    print('API List = ' + API_KEY_NUM)
    api_list = []

    for i in range(1, int(API_KEY_NUM) + 1):
        # Below function takes API_KEY and API_SECRET as arguments.
        # We are using AppAuthHandler rather than frequently used OAuthHandler because former sets up app only Auth and 
        # provide higher limits. 
        API_KEY = config.get('auth_list','API_KEY_' + str(i))
        API_SECRET = config.get('auth_list','API_SECRET_' + str(i))

        
        auth = tweepy.AppAuthHandler(API_KEY, API_SECRET)
        # wait_on_rate_limit and wait_on_rate_limit_notify are set to true which allow Tweepy API call auto wait (sleep) once rate limit
        # is reached and then continue when the required window gets expired and hence you dont have to do it manually.
        api = tweepy.API(auth, wait_on_rate_limit=True,wait_on_rate_limit_notify=True)
         # simple if loop which test above api variable.
        if (not api):
            print ("We are unable to authenticate the given credentials. Please check and come back later")
            #sys.exit(-1)
        else:
            api_list.append(api)

    return api_list