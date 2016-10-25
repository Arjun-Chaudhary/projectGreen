package yikaig;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import twitter4j.FilterQuery;
import twitter4j.TwitterStream;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

/**
 * @author Yikai Gong
 */

@SpringBootApplication
public class Launcher {
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private TwitterStream twitterStream;

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(Launcher.class);
        ConfigurableApplicationContext context = application.run(args);
    }

    @PostConstruct
    public void start(){
        FilterQuery filterQuery = new FilterQuery();
        //{{longitude1, lat1}, {longitude2, lat2}}
        double[][] boundingBox = {{144.811478, -37.929863}, {145.135574, -37.731370}};
        filterQuery.locations(boundingBox);
        twitterStream.filter(filterQuery);
    }

    @PreDestroy
    public void shutdown(){
        twitterStream.cleanUp();
    }
}
