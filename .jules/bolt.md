## 2025-02-20 - Closure Allocation in Hot Loops
**Learning:** In vanilla JS without a build step, defining helper functions inside a frequently called method (like a renderer) causes function reallocation on every call. Combined with array-based vector math, this creates significant GC pressure and overhead.
**Action:** Move stateless helpers to module/file scope. For critical hot paths (ray marching), inline vector math to use scalar variables instead of allocating vector arrays.

## 2025-02-20 - Trig Function Roundtrips
**Learning:** In ray marching loops, converting cosine values (from dot products) to angles using `acos` just to pass them to a function that immediately converts them back to sin/cos is wasteful.
**Action:** Pass cosine values directly to helper functions. Use `sqrt(1 - cos^2)` to derive sin/x-component if needed (assuming positive sine for 0..PI range). This avoids expensive `Math.acos`, `Math.sin`, and `Math.cos` calls in hot loops.
