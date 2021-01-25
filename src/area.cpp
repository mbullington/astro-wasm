// https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#embind
#include <emscripten/bind.h>

#include <string>
#include <math.h>

using namespace emscripten;

#define RADIUS 6378137;

struct LngLat {
    float lng;
    float lat;
};

float rad(float deg) {
    return deg * M_PI / 180;
};

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
float ringArea(emscripten::val coordsJS) {
    int coordsLength = coordsJS["length"].as<int>();
    if (!coordsLength || coordsLength <= 2) {
        return 0;
    }

    LngLat p1, p2, p3;
    int lowerIndex, middleIndex, upperIndex, i = 0;

    for (i = 0; i < coordsLength; i++) {
      if (i == coordsLength - 2) {
        // i = N-2
        lowerIndex = coordsLength - 2;
        middleIndex = coordsLength - 1;
        upperIndex = 0;
      } else if (i == coordsLength - 1) {
        // i = N-1
        lowerIndex = coordsLength - 1;
        middleIndex = 0;
        upperIndex = 1;
      } else {
        // i = 0 to N-3
        lowerIndex = i;
        middleIndex = i + 1;
        upperIndex = i + 2;
      }

      p1 = coords[std::to_string(lowerIndex)].as<LngLat>();
      p2 = coords[std::to_string(middleIndex)].as<LngLat>();
      p3 = coords[std::to_string(upperIndex)].as<LngLat>();

      if (!p1 || !p2 || !p3) {
          // TODO: Add real errors.
          return -1000000;
      }

      total += (rad(p3[0]) - rad(p1[0])) * sin(rad(p2[1]));
    }

    return = (total * RADIUS * RADIUS) / 2;
};

float geomArea(emscripten::val geomJS) {
    int numRings = geomJS["length"].as<int>();
    if (!numRings) {
        return 0;
    }

    int i = 0;
    for (; i < numRings; i++) {
        // The other rings are 'holes' so we subtract them.
        float modifier = i == 0 ? 1 : -1;

        emscripten::val coordsJS = geomJS[std::to_string(i)];
        total += modifier * ringArea(coordsJS);
    }

    return total;
};

EMSCRIPTEN_BINDINGS(astro_area) {
    value_array<LngLat>("LngLat")
        .element(&LngLat::lng)
        .element(&LngLat::lat)
        ;

    function("geomArea", &geomArea);
}
