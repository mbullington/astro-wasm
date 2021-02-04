# astro-wasm

Experimental geospatial library modeled after [Turf.js](https://github.com/Turfjs/turf) written in C/WASM.

This project is part of my PSU Schreyer Undergraduate Thesis under [Danfeng Zhang](http://www.cse.psu.edu/~dbz5017/), which looks to benchmark and document the performance characteristics of a WASM implemention vs. JS along with GeoJSON decoding/reencoding between JS-WASM.

## Progress

Right now I'm implementing different algorithms and assessing their performance vs. Turf.js:

- [x] `area`
- [ ] `union` - Implemented but needs unit tests for correctness.
- [ ] `intersect` - Implemented but needs unit tests for correctness.
- [ ] `difference` - Implemented but needs unit tests for correctness.

So far with small-`n` polygons, TURF.js is beating the WASM implementation by consistently ~1,000 ops per second. Next steps here are to build out the bench to test different `n` complexity of polygons and average them.

Also looking into WASM performance tools to avoid optimizing in the wrong places.

## Sources

[Turf.js](https://github.com/Turfjs/turf): Included code in `LICENSE`

--- 

Robert. G. Chamberlain and William H. Duquette, "*Some Algorithms for Polygons on a Sphere*",
* JPL Publication 07-03, Jet Propulsion
* Laboratory, Pasadena, CA, June 2007 https://trs.jpl.nasa.gov/handle/2014/40409

---

Alfred Melch, "*Performance comparison of simplification algorithms for polygons in the context of web applications*"
* Universit¨at Augsburg, Augsburg, August 2019 https://mt.melch.pro/mt-polygon-simplification.pdf

---

Francisco Martinez, Antonio Jesus Rueda, Francisco Ramon Feito, "*A new algorithm for computing Boolean operations on polygons.* (2008, 2013)
* https://www.sciencedirect.com/science/article/abs/pii/S0965997813000379
* The C++ code from this paper (originally under public domain) has been modified under `third_party/martinez`. Modifications are ergonomic and do not change the algorithm.