#pragma once

#include <vector> 
#include <emscripten/emscripten.h>

using namespace std;

#define EXPORT EMSCRIPTEN_KEEPALIVE

// Structures.

typedef struct LngLat_s {
  double lng;
  double lat;
} LngLat;

typedef vector<LngLat*> LineString;

typedef vector<LineString*> Polygon;

// LngLat type.

LngLat *create_lnglat(double lng, double lat);
void delete_lnglat(LngLat *lnglat);

// LineString type.

EXPORT LineString *create_linestring() asm("create_linestring");
EXPORT void push_linestring(LineString *linestring, double lng, double lat) asm("push_linestring");
EXPORT void delete_linestring(LineString *linestring) asm("delete_linestring");

// Polygon type.

EXPORT Polygon *create_polygon() asm("create_polygon");
EXPORT void push_polygon(Polygon *polygon, LineString *ring) asm("push_polygon");
EXPORT void delete_polygon(Polygon *polygon) asm("delete_polygon");