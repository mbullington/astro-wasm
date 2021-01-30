#include <cmath>

#include <stdint.h>
#include <stdlib.h>
#include <stddef.h>

#include "geometry.hpp"
#include "common.hpp"

using namespace std;

// For some reason Emscripten doesn't include M_PI.
#define PI 3.14159265358979323846
#define RADIUS 6378137

EXPORT double polygon_area(Polygon *polygon) asm("polygon_area");

double rad(double deg);

/**
 * Calculate the approximate area of the polygon were it projected onto the earth.
 * Note that this area will be positive if ring is oriented clockwise, otherwise it will be negative.
 *
 * Reference:
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for Polygons on a Sphere",
 * JPL Publication 07-03, Jet Propulsion
 * Laboratory, Pasadena, CA, June 2007 https://trs.jpl.nasa.gov/handle/2014/40409
 *
 * @param {Array<Array<number>>} coords Ring Coordinates
 * @returns {number} The approximate signed geodesic area of the polygon in square meters.
 */
double ring_area(LinearRing *ring) {
    size_t length = ring->size();
    if (length <= 2) {
        return 0;
    }

    LngLat *p1 = NULL;
    LngLat *p2 = NULL;
    LngLat *p3 = NULL;

    int lowerIndex = 0, middleIndex = 0, upperIndex = 0, i = 0;
    double total = 0;

    for (; i < length; i++) {
      if (i == length - 2) {
        // i = N-2
        lowerIndex = length - 2;
        middleIndex = length - 1;
        upperIndex = 0;
      } else if (i == length - 1) {
        // i = N-1
        lowerIndex = length - 1;
        middleIndex = 0;
        upperIndex = 1;
      } else {
        // i = 0 to N-3
        lowerIndex = i;
        middleIndex = i + 1;
        upperIndex = i + 2;
      }

      p1 = &ring->at(lowerIndex);
      p2 = &ring->at(middleIndex);
      p3 = &ring->at(upperIndex);

      // total += p1.lng;
      total += (rad(p3->x) - rad(p1->x)) * sin(rad(p2->y));
    }

    return (total * RADIUS * RADIUS) / 2;
};

double polygon_area(Polygon *polygon) {
    size_t length = polygon->size();
    if (length < 1) {
        return 0;
    }

    int i = 0;
    double total = 0;
    for (; i < length; i++) {
        // The other rings are 'holes' so we subtract them.
        double modifier = i == 0 ? 1 : -1;
        total += modifier * abs(ring_area(&polygon->at(i)));
    }

    return total;
};

double rad(double deg) {
    return deg * PI / 180;
};
