package yikaig.spatialDB.entity;

import com.vividsolutions.jts.geom.Geometry;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author Yikai Gong
 */

@Entity
@Table(name="street_vic_3111")
public class StreetEntity {
    @Id
    @Column(name = "gid")
    private Integer gid;
    private String full_name;
    private String st_lne_pid;
    private String route_num;

    /** Defines a mapping from a Java type to an JDBC data-type when customization are needed*/
    @Type(type="org.hibernate.spatial.GeometryType")
    private Geometry geom;

    public StreetEntity() {
    }

    public Integer getGid() {
        return gid;
    }

    public void setGid(Integer gid) {
        this.gid = gid;
    }

    public String getFull_name() {
        return full_name;
    }

    public void setFull_name(String full_name) {
        this.full_name = full_name;
    }

    public String getSt_lne_pid() {
        return st_lne_pid;
    }

    public void setSt_lne_pid(String st_lne_pid) {
        this.st_lne_pid = st_lne_pid;
    }

    public String getRoute_num() {
        return route_num;
    }

    public void setRoute_num(String route_num) {
        this.route_num = route_num;
    }

    public Geometry getGeom() {
        return geom;
    }

    public void setGeom(Geometry geom) {
        this.geom = geom;
    }

    @Override
    public String toString() {
        ReflectionToStringBuilder toStringBuilder = new ReflectionToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE);
        return toStringBuilder.toString();
    }
}
