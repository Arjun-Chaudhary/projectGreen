package yikaig.spatialDB.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import yikaig.spatialDB.entity.StreetEntity;

import java.util.List;

/**
 * @author Yikai Gong
 */

public interface StreetRepository extends CrudRepository<StreetEntity, Integer> {

    @Query(value = "SELECT * FROM street_vic_3111 AS street WHERE ST_DWithin(ST_Transform(ST_SetSRID(ST_MakePoint(:lon,:lat), 4326), 3111), street.geom, 10)", nativeQuery = true)
    public List<StreetEntity> findNearByStreets(@Param("lon") Double lon, @Param("lat") Double lat);
}
