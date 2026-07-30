import { describe, it, expect } from "vitest";
import { stringifyCsv, parseCsv } from "./csv";

describe("stringifyCsv", () => {
  it("joins simple fields with commas and rows with CRLF", () => {
    expect(stringifyCsv([["a", "b", "c"], ["1", "2", "3"]])).toBe("a,b,c\r\n1,2,3");
  });

  it("quotes fields containing commas, quotes, or newlines", () => {
    expect(stringifyCsv([["hello, world"]])).toBe('"hello, world"');
    expect(stringifyCsv([['say "hi"']])).toBe('"say ""hi"""');
    expect(stringifyCsv([["line1\nline2"]])).toBe('"line1\nline2"');
  });

  it("prefixes formula-like leading characters with an apostrophe (CSV injection protection)", () => {
    expect(stringifyCsv([["=SUM(A1:A2)"]])).toBe("'=SUM(A1:A2)");
    expect(stringifyCsv([["+1234"]])).toBe("'+1234");
    expect(stringifyCsv([["-1234"]])).toBe("'-1234");
    expect(stringifyCsv([["@cmd"]])).toBe("'@cmd");
  });

  it("leaves ordinary text alone", () => {
    expect(stringifyCsv([["Diwali 2026 promo"]])).toBe("Diwali 2026 promo");
  });
});

describe("parseCsv", () => {
  it("parses a simple multi-row CSV", () => {
    expect(parseCsv("a,b,c\n1,2,3")).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
  });

  it("handles CRLF line endings", () => {
    expect(parseCsv("a,b\r\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("unescapes doubled quotes inside a quoted field", () => {
    expect(parseCsv('a,"say ""hi""",c')).toEqual([["a", 'say "hi"', "c"]]);
  });

  it("preserves an embedded comma inside a quoted field", () => {
    expect(parseCsv('"hello, world",b')).toEqual([["hello, world", "b"]]);
  });

  it("returns an empty array for empty input", () => {
    expect(parseCsv("")).toEqual([]);
  });

  it("round-trips a table of ordinary values", () => {
    const rows = [
      ["scopeCountry", "label"],
      ["IN", "Diwali 2026 promo"],
      ["", "Global launch discount"],
    ];
    expect(parseCsv(stringifyCsv(rows))).toEqual(rows);
  });
});
