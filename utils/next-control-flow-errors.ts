/**
 * Next.js signals certain framework control flow (bail out of static
 * rendering because `cookies()`/`headers()` was read, `redirect()`,
 * `notFound()`) by throwing an `Error` with a well-known `digest`. A
 * `catch` block that doesn't re-throw these swallows the signal Next.js
 * needs — e.g. `cookies()` throws this during the build's static-render
 * attempt for any authenticated page, which a generic `catch { ... }`
 * then logs and reports as a real failure even though the route renders
 * fine per-request once deployed. Guard every such `catch` with this.
 */
export function isNextControlFlowError(error: unknown): boolean {
  const digest = (error as { digest?: unknown } | null)?.digest;
  return (
    typeof digest === "string" &&
    (digest === "DYNAMIC_SERVER_USAGE" || digest.startsWith("NEXT_"))
  );
}
