package yikaig.beans;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import twitter4j.*;
import yikaig.spatialDB.entity.StreetEntity;
import yikaig.spatialDB.repository.StreetRepository;

import java.util.List;


/**
 * @author Yikai Gong
 */

public class MyListener implements StatusListener {
    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
    public JsonParser jsonParser = new JsonParser();
    private WebServiceConnector connector;
    private StreetRepository streetRepository;

    public MyListener(WebServiceConnector connector, StreetRepository streetRepository) {
        this.connector = connector;
        this.streetRepository = streetRepository;
    }

    @Override
    public void onStatus(Status status) {
        String id = Long.toString(status.getId());
        String rawJSON = TwitterObjectFactory.getRawJSON(status);
        JsonObject tweet = (JsonObject)jsonParser.parse(rawJSON);
//        tweet.remove("entities");
        tweet.remove("id");
//        tweet.remove("retweeted_status");
//        System.out.println(tweet.toString());
        JsonElement geo = tweet.get("geo");
        boolean onStreet = false;
        // TODO refactor into methods
        if(geo.isJsonObject()) {
            JsonObject geoObj = geo.getAsJsonObject();
            Double lat = geoObj.getAsJsonArray("coordinates").get(0).getAsDouble();
            Double lon = geoObj.getAsJsonArray("coordinates").get(1).getAsDouble();
            logger.debug(lon + ", " + lat);
            List<StreetEntity> streetLists = streetRepository.findNearByStreets(lon, lat);
            // TODO figure out the closest street and attach the information to output json
            if(streetLists.size()>0){
                onStreet = true;
            }
        } else{
            logger.debug("geo is not JsonObject");
        }
        tweet.addProperty("onStreet", onStreet);

        try{
            //try send tweet to server once got a tweet
            connector.send(tweet);
        }catch(Exception e){
            try{
                // try connect or reconnect to the server when send method fails
                String url = "ws://localhost:8080/streamAppEndPoint";
                logger.info("Try connect/reconnect to server " + url);
                connector.connectToServer(url);
                connector.send(tweet);
            }catch (Exception ex){
                logger.info("Cannot find the web server");
            }
        }
    }

    @Override
    public void onDeletionNotice(StatusDeletionNotice statusDeletionNotice) {
        logger.info("Got a status deletion notice id:" + statusDeletionNotice.getStatusId());
    }

    @Override
    public void onTrackLimitationNotice(int i) {
        logger.info("Got track limitation notice:" + i);
    }

    @Override
    public void onScrubGeo(long l, long l2) {
        logger.info("Got scrub_geo event userId:" + l + " upToStatusId:" + l2);
    }

    @Override
    public void onStallWarning(StallWarning stallWarning) {
        logger.info("Got Stall Warning:" + stallWarning.getMessage());
    }

    @Override
    public void onException(Exception e) {
        e.printStackTrace();
    }
}
