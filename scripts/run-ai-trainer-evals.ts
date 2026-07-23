// Runs the deterministic red-flag interceptor eval suite.
// Usage: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/run-ai-trainer-evals.ts
import { interceptRedFlags } from "../utils/ai-trainer/redFlagInterceptor";
import { interceptorEvalCases } from "../utils/ai-trainer/evalCases";

let passed = 0;
let failed = 0;

for (const testCase of interceptorEvalCases) {
  const result = interceptRedFlags(testCase.message);
  const interceptMatches = result.intercepted === testCase.expectIntercept;

  let categoriesMatch = true;
  if (testCase.expectedCategories) {
    const expected = [...testCase.expectedCategories].sort();
    const actual = [...result.matchedCategories].sort();
    categoriesMatch = JSON.stringify(expected) === JSON.stringify(actual);
  }

  const ok = interceptMatches && categoriesMatch;
  if (ok) {
    passed++;
    console.log(`PASS  ${testCase.id}`);
  } else {
    failed++;
    console.log(`FAIL  ${testCase.id}`);
    console.log(`      message: "${testCase.message}"`);
    console.log(`      expected: intercept=${testCase.expectIntercept} categories=${JSON.stringify(testCase.expectedCategories ?? [])}`);
    console.log(`      actual:   intercept=${result.intercepted} categories=${JSON.stringify(result.matchedCategories)}`);
  }
}

console.log(`\n${passed}/${interceptorEvalCases.length} passed`);
if (failed > 0) {
  process.exit(1);
}
