#include <vector> 
#include <algorithm>

#include "geometry.hpp"

using namespace std; 

// LngLat type.

LngLat *create_lnglat(double lng, double lat) {
    LngLat *lnglat = new LngLat;
    lnglat->lng = lng;
    lnglat->lat = lat;
    return lnglat;
}

void delete_lnglat(LngLat *lnglat) {
    delete lnglat;
}

// LineString type.

LineString *create_linestring() {
    return new LineString();
}

void push_linestring(LineString *linestring, double lng, double lat) {
    linestring->push_back(create_lnglat(lng, lat));
}

void delete_linestring(LineString *linestring) {
    for_each(begin(*linestring), end(*linestring), delete_lnglat);
    delete linestring;
}

// Polygon type.

Polygon *create_polygon() {
    return new Polygon();
}

void push_polygon(Polygon *polygon, LineString *ring) {
    polygon->push_back(ring);
}

void delete_polygon(Polygon *polygon) {
    for_each(begin(*polygon), end(*polygon), delete_linestring);
    delete polygon;
}