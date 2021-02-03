#include <cmath>

#include "point.h"

using namespace std;
using namespace martinez;

double martinez::point_dist(const Point& a, const Point& b) {
    float dx = a.x - b.x;
    float dy = a.y - b.y;
    return sqrt (dx * dx + dy * dy);
}