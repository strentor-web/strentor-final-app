// @react-three/fiber v8's JSX intrinsic-element types (mesh, group, etc.)
// augment the classic global `JSX` namespace, but this project's installed
// @types/react (v19 typings) moved that namespace to `React.JSX` — so the
// two never merge on their own. This re-declares the same augmentation
// against the namespace @types/react 19 actually resolves against.
import { ThreeElements } from "@react-three/fiber"

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
