package yikaig.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import twitter4j.StatusListener;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;
import twitter4j.conf.ConfigurationBuilder;
import yikaig.beans.WebServiceConnector;
import yikaig.beans.MyListener;
import yikaig.spatialDB.repository.StreetRepository;

/**
 * @author Yikai Gong
 */

@Configuration
public class BeanConfig {
    @Autowired
    private StreetRepository streetRepository;

    @Bean
    public ConfigurationBuilder twitter4jConfigurationBuilder(){
        ConfigurationBuilder cb = new ConfigurationBuilder();
        cb.setDebugEnabled(true);
        cb.setJSONStoreEnabled(true);
        cb.setOAuthConsumerKey("WbOlRQ57jyp9vnvb5ADLH5bTR");
        cb.setOAuthConsumerSecret("VwtIz3DtPcxFhYrk0PuP9yoldyz9Da9Ej6FzHTtNPyHJDNXNLW");
        cb.setOAuthAccessToken("2467677446-WNTeaJVNyIvgl7aWhyOanh1sXX0PsN7hOww9kfu");
        cb.setOAuthAccessTokenSecret("DU8kRPStao0lFzkGKNqYlGeojs34lPyttOh4R0dbU5HdW");
        return cb;
    }

    @Bean
    public WebServiceConnector webServiceConnector(){
        return new WebServiceConnector();
    }

    @Bean
    public StatusListener myListener(WebServiceConnector webServiceConnector){
        return new MyListener(webServiceConnector, streetRepository);
    }

    /* There are two ways for Bean injection for @Bean. See: https://dzone.com/articles/spring-configuration-and */
    @Bean
    public TwitterStream twitterStream(ConfigurationBuilder cb, StatusListener myListener){
        TwitterStream twitterStream = new TwitterStreamFactory(cb.build()).getInstance();
        twitterStream.addListener(myListener);
        return twitterStream;
    }

}
