"use client"

import { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
  /** Called once if the 3D subtree throws, so a caller can swap in a static fallback. */
  onError?: () => void
}

interface State {
  hasError: boolean
}

/**
 * Contains any crash from the 3D layer (react-reconciler / WebGL) to just
 * this subtree. These components are pure decorative enhancements over
 * static content that's already on the page — a failure here must never
 * take down the rest of the page.
 */
export class ThreeErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error("3D layer failed to render; degrading gracefully.", error)
    this.props.onError?.()
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
