// @react-three/fiber v8 augments the global `JSX` namespace with Three.js
// intrinsic elements (mesh, sphereGeometry, etc). @types/react 19 moved JSX
// resolution to `React.JSX` instead of the global namespace, so that
// augmentation no longer merges in. Re-declare it against the namespace
// this project's TypeScript actually resolves against.
import type { ThreeElements } from "@react-three/fiber";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
