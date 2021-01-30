(function(exports){"use strict";
const WASM_DATA = require("zlib").brotliDecompressSync(Buffer.from("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","base64"));
var n,e,t,r,i,o,a,s,u,c,l,f,p,m,d,y,h,g,_,w,b,A,v,R,x,E,I,P,W,M,T,D,S,F,H,U,j,O,q,k,z,B;let C;try{C=require("path")}catch(n){}function L(n){throw new Error("wasm abort"+(n?": "+(n.stack||n):""))}"undefined"!=typeof module&&(c=module,module=void 0),(l={preRun:[],postRun:[],print:console.log.bind(console),printErr:console.error.bind(console),instantiateWasm(n,e){let t=new WebAssembly.Instance(new WebAssembly.Module(N()),n);return e(t),t.exports},wasmBinary:WASM_DATA}).ready=new Promise(c=>{l.onRuntimeInitialized=(()=>{l.___wasm_call_ctors=n=l.asm.f,l._polygon_area=e=l.asm.g,l._create_linestring=t=l.asm.h,l._push_linestring=r=l.asm.i,l._delete_linestring=l.asm.j,l._create_polygon=i=l.asm.k,l._push_polygon=o=l.asm.l,l._delete_polygon=a=l.asm.m,l.__ZSt18uncaught_exceptionv=s=l.asm.n,l._malloc=u=l.asm.o,l.dynCall_vi=l.asm.p;let f=exports;"function"==typeof define&&define("astro",f),c(f)})}),C&&(l.locateFile=function(n){return C.join(__dirname,n)}),l.print;let Y=l.printErr;for(p in f={},l=void 0!==l?l:{})l.hasOwnProperty(p)&&(f[p]=l[p]);for(p in m=[],"",d=__dirname+"/",y=function(n,e){return g||(g=require("fs")),_||(_=require("path")),n=_.normalize(n),g.readFileSync(n,e?null:"utf8")},h=function(n){var e=y(n,!0);return e.buffer||(e=new Uint8Array(e)),e.buffer,e},process.argv.length>1&&process.argv[1].replace(/\\/g,"/"),m=process.argv.slice(2),"undefined"!=typeof module&&(module.exports=l),l.inspect=function(){return"[Emscripten Module object]"},f)f.hasOwnProperty(p)&&(l[p]=f[p]);function Z(n,e){return n%e>0&&(n+=e-n%e),n}function G(n){R=n,l.HEAP8=x=new Int8Array(n),l.HEAP16=new Int16Array(n),l.HEAP32=I=new Int32Array(n),l.HEAPU8=E=new Uint8Array(n),l.HEAPU16=new Uint16Array(n),l.HEAPU32=new Uint32Array(n),l.HEAPF32=new Float32Array(n),l.HEAPF64=new Float64Array(n)}function J(n){for(var e,t;n.length>0;)"function"!=typeof(e=n.shift())?"number"==typeof(t=e.func)?void 0===e.arg?l.dynCall_v(t):l.dynCall_vi(t,e.arg):t(void 0===e.arg?null:e.arg):e()}function K(n){return String.prototype.startsWith?n.startsWith(U):0===n.indexOf(U)}function N(){try{if(w)return new Uint8Array(w);if(h)return h(j);throw"both async and sync fetching of the wasm failed"}catch(n){L(n)}}function Q(n){function e(){z||(z=!0,v||(J(M),J(T),l.onRuntimeInitialized&&l.onRuntimeInitialized(),function(){if(l.postRun)for("function"==typeof l.postRun&&(l.postRun=[l.postRun]);l.postRun.length;)n=l.postRun.shift(),D.unshift(n);var n;J(D)}()))}n=n||m,S>0||(function(){if(l.preRun)for("function"==typeof l.preRun&&(l.preRun=[l.preRun]);l.preRun.length;)n=l.preRun.shift(),W.unshift(n);var n;J(W)}(),S>0||(l.setStatus?(l.setStatus("Running..."),setTimeout(function(){setTimeout(function(){l.setStatus("")},1),e()},1)):e()))}if(f=null,l.arguments&&(m=l.arguments),l.thisProgram&&l.thisProgram,l.quit&&l.quit,l.wasmBinary&&(w=l.wasmBinary),l.noExitRuntime&&l.noExitRuntime,"object"!=typeof WebAssembly&&Y("no native wasm support detected"),A=new WebAssembly.Table({initial:22,maximum:22,element:"anyfunc"}),v=!1,"undefined"!=typeof TextDecoder&&new TextDecoder("utf8"),"undefined"!=typeof TextDecoder&&new TextDecoder("utf-16le"),65536,5247920,4880,P=l.TOTAL_MEMORY||16777216,(b=l.wasmMemory?l.wasmMemory:new WebAssembly.Memory({initial:P/65536}))&&(R=b.buffer),P=R.byteLength,G(R),I[1220]=5247920,W=[],M=[],T=[],D=[],S=0,F=null,H=null,l.preloadedImages={},l.preloadedAudios={},U="data:application/octet-stream;base64,",K(j="astro.wasm")||(B=j,j=l.locateFile?l.locateFile(B,d):d+B),M.push({func:function(){n()}}),O={},q={e:function(n){return u(n)},d:function(n,e,t){throw O[n]={ptr:n,adjusted:[n],type:e,destructor:t,refcount:0,caught:!1,rethrown:!1},"uncaught_exception"in s?s.uncaught_exceptions++:s.uncaught_exceptions=1,n},c:function(){L()},a:function(n,e,t){E.set(E.subarray(e,e+t),n)},b:function(n){var e,t=x.length;if(n>2147418112)return!1;for(16777216,e=Math.max(t,16777216);e<n;)e=e<=536870912?Z(2*e,65536):Math.min(Z((3*e+2147483648)/4,65536),2147418112);return!!function(n){try{return b.grow(n-R.byteLength+65535>>16),G(b.buffer),1}catch(n){}}(e)},memory:b,table:A},k=function(){var n={env:q,wasi_unstable:q};function e(n,e){var t=n.exports;l.asm=t,function(n){if(S--,l.monitorRunDependencies&&l.monitorRunDependencies(S),0==S&&(null!==F&&(clearInterval(F),F=null),H)){var e=H;H=null,e()}}()}function t(n){e(n.instance)}function r(e){return new Promise(function(n,e){n(N())}).then(function(e){return WebAssembly.instantiate(e,n)}).then(e,function(n){Y("failed to asynchronously prepare wasm: "+n),L(n)})}if(S++,l.monitorRunDependencies&&l.monitorRunDependencies(S),l.instantiateWasm)try{return l.instantiateWasm(n,e)}catch(n){return Y("Module.instantiateWasm callback failed with error: "+n),!1}return function(){if(w||"function"!=typeof WebAssembly.instantiateStreaming||K(j)||"function"!=typeof fetch)return r(t);fetch(j,{credentials:"same-origin"}).then(function(e){return WebAssembly.instantiateStreaming(e,n).then(t,function(n){Y("wasm streaming compile failed: "+n),Y("falling back to ArrayBuffer instantiation"),r(t)})})}(),{}}(),l.asm=k,n=l.___wasm_call_ctors=function(){return l.asm.f.apply(null,arguments)},l.asm=k,H=function n(){z||Q(),z||(H=n)},l.run=Q,l.preInit)for("function"==typeof l.preInit&&(l.preInit=[l.preInit]);l.preInit.length>0;)l.preInit.pop()();Q(),l.inspect=(()=>"[asm]"),void 0!==c&&(module=c,c=void 0),Object.defineProperty(exports,"__esModule",{value:!0});const V=l.ready;exports.ready=V,exports.Astro=class Astro{constructor(n){const e=n.geometry.coordinates;let a=0;const s=i();for(;a<e.length;a++){const n=e[a],i=t();let u=0;for(;u<n.length;u++){const e=n[u];r(i,e[0],e[1])}o(s,i)}this.ptr=s}area(){return e(this.ptr)}destroy(){a(this.ptr)}};})(typeof exports!='undefined'?exports:this["astro"]={})
//# sourceMappingURL=astro.js.map
