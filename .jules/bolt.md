## 2025-02-20 - Closure Allocation in Hot Loops
**Learning:** In vanilla JS without a build step, defining helper functions inside a frequently called method (like a renderer) causes function reallocation on every call. Combined with array-based vector math, this creates significant GC pressure and overhead.
**Action:** Move stateless helpers to module/file scope. For critical hot paths (ray marching), inline vector math to use scalar variables instead of allocating vector arrays.
