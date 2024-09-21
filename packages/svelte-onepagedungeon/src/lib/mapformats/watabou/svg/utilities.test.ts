import { describe, expect, test } from "vitest";
import { SVGUtils } from "./utilities.js";
import { JSDOM } from "jsdom";

describe("groupLinePath", () => {
  const bounds = [
    { left: 0, right: 10, top: 0, bottom: 10 },
    { left: 10, right: 20, top: 0, bottom: 20 },
    { left: 0, right: 10, top: 10, bottom: 20 },
  ];

  const document = new JSDOM().window.document;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M 1,1 L 5,5 M 11,11 L 15,15 M 6,6 L 9,9");

  test("should group line segments inside each bound", () => {
    const groups = SVGUtils.groupLinePath(bounds, path);
    expect(groups.length).toBe(3);
    expect(groups[0]?.getAttribute("d")).toBe("M 1,1 L 5,5 M 6,6 L 9,9");
    expect(groups[1]?.getAttribute("d")).toBe("M 11,11 L 15,15");
    expect(groups[2]).toBeNull();
  });

  test("should return an empty array if path has no line segments", () => {
    const emptyPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    emptyPath.setAttribute("d", "M 1,1");
    const groups = SVGUtils.groupLinePath(bounds, emptyPath);
    expect(groups.length).toBe(3);
    expect(groups[0]).toBeNull();
    expect(groups[1]).toBeNull();
    expect(groups[2]).toBeNull();
  });

  test("should throw an error if path has no 'd' attribute", () => {
    const pathWithoutD = document.createElementNS("http://www.w3.org/2000/svg", "path");
    expect(() => SVGUtils.groupLinePath(bounds, pathWithoutD)).toThrowError("No path data found");
  });

  describe("pathBoundsCheck", () => {
    const bounds = [
      { left: 0, right: 10, top: 0, bottom: 10 },
      { left: 10, right: 20, top: 0, bottom: 20 },
      { left: 0, right: 10, top: 10, bottom: 20 },
    ];

    const document = new JSDOM().window.document;

    test("should return the correct bound index for a path inside the first bound", () => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M 1,1 L 5,5");
      const index = SVGUtils.pathBoundsCheck(bounds, path);
      expect(index).toBe(0);
    });

    test("should return the correct bound index for a path inside the second bound", () => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M 11,1 L 15,5");
      const index = SVGUtils.pathBoundsCheck(bounds, path);
      expect(index).toBe(1);
    });

    test("should return the correct bound index for a path inside the third bound", () => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M 1,11 L 5,15");
      const index = SVGUtils.pathBoundsCheck(bounds, path);
      expect(index).toBe(2);
    });

    test("should return undefined for a path outside all bounds", () => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M 21,21 L 25,25");
      const index = SVGUtils.pathBoundsCheck(bounds, path);
      expect(index).toBeUndefined();
    });

    test("should return undefined for a path with no 'd' attribute", () => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      expect(() => SVGUtils.pathBoundsCheck(bounds, path)).toThrowError();
    });

    describe("linesInside", () => {
      const bound = { left: 0, right: 10, top: 0, bottom: 10 };

      test("should return line segments completely inside the bound", () => {
        const segments = [
          { start: { x: 1, y: 1 }, end: { x: 5, y: 5 } },
          { start: { x: 2, y: 2 }, end: { x: 8, y: 8 } },
          { start: { x: 11, y: 11 }, end: { x: 15, y: 15 } },
        ];
        const result = SVGUtils.linesInside(bound, segments);
        expect(result).toEqual([
          { start: { x: 1, y: 1 }, end: { x: 5, y: 5 } },
          { start: { x: 2, y: 2 }, end: { x: 8, y: 8 } },
        ]);
      });

      test("should return an empty array if no line segments are inside the bound", () => {
        const segments = [
          { start: { x: 11, y: 11 }, end: { x: 15, y: 15 } },
          { start: { x: 12, y: 12 }, end: { x: 18, y: 18 } },
        ];
        const result = SVGUtils.linesInside(bound, segments);
        expect(result).toEqual([]);
      });

      test("should return an empty array if segments are partially inside the bound", () => {
        const segments = [
          { start: { x: 5, y: 5 }, end: { x: 15, y: 15 } },
          { start: { x: -1, y: -1 }, end: { x: 5, y: 5 } },
        ];
        const result = SVGUtils.linesInside(bound, segments);
        expect(result).toEqual([]);
      });

      test("should return line segments exactly on the bound", () => {
        const segments = [
          { start: { x: 0, y: 0 }, end: { x: 10, y: 10 } },
          { start: { x: 10, y: 0 }, end: { x: 0, y: 10 } },
        ];
        const result = SVGUtils.linesInside(bound, segments);
        expect(result).toEqual([
          { start: { x: 0, y: 0 }, end: { x: 10, y: 10 } },
          { start: { x: 10, y: 0 }, end: { x: 0, y: 10 } },
        ]);
      });

      describe("enlargeBound", () => {
        test("should enlarge the bound by the given amount", () => {
          const bound = { left: 10, right: 20, top: 10, bottom: 20 };
          const amount = 5;
          const enlargedBound = SVGUtils.enlargeBound(bound, amount);
          expect(enlargedBound).toEqual({
            left: 5,
            right: 25,
            top: 5,
            bottom: 25,
          });
        });

        test("should handle negative enlargement amounts", () => {
          const bound = { left: 10, right: 20, top: 10, bottom: 20 };
          const amount = -5;
          const enlargedBound = SVGUtils.enlargeBound(bound, amount);
          expect(enlargedBound).toEqual({
            left: 15,
            right: 15,
            top: 15,
            bottom: 15,
          });
        });

        test("should handle zero enlargement amount", () => {
          const bound = { left: 10, right: 20, top: 10, bottom: 20 };
          const amount = 0;
          const enlargedBound = SVGUtils.enlargeBound(bound, amount);
          expect(enlargedBound).toEqual(bound);
        });

        test("should handle enlargement of bounds with negative coordinates", () => {
          const bound = { left: -10, right: -5, top: -10, bottom: -5 };
          const amount = 5;
          const enlargedBound = SVGUtils.enlargeBound(bound, amount);
          expect(enlargedBound).toEqual({
            left: -15,
            right: 0,
            top: -15,
            bottom: 0,
          });
        });

        describe("minBound", () => {
          test("should return the bound with the smallest area", () => {
            const bounds = [
              { left: 0, right: 10, top: 0, bottom: 10 },
              { left: 0, right: 5, top: 0, bottom: 5 },
              { left: 0, right: 3, top: 0, bottom: 3 },
            ];
            const result = SVGUtils.minBound(bounds);
            expect(result).toEqual({ left: 0, right: 3, top: 0, bottom: 3 });
          });

          test("should ignore bounds with zero width", () => {
            const bounds = [
              { left: 0, right: 0, top: 0, bottom: 10 },
              { left: 0, right: 5, top: 0, bottom: 5 },
              { left: 0, right: 3, top: 0, bottom: 3 },
            ];
            const result = SVGUtils.minBound(bounds);
            expect(result).toEqual({ left: 0, right: 3, top: 0, bottom: 3 });
          });

          test("should ignore bounds with zero height", () => {
            const bounds = [
              { left: 0, right: 10, top: 0, bottom: 0 },
              { left: 0, right: 5, top: 0, bottom: 5 },
              { left: 0, right: 3, top: 0, bottom: 3 },
            ];
            const result = SVGUtils.minBound(bounds);
            expect(result).toEqual({ left: 0, right: 3, top: 0, bottom: 3 });
          });

          test("should return the first bound if all bounds have zero area", () => {
            const bounds = [
              { left: 0, right: 0, top: 0, bottom: 0 },
              { left: 1, right: 1, top: 1, bottom: 1 },
              { left: 2, right: 2, top: 2, bottom: 2 },
            ];
            const result = SVGUtils.minBound(bounds);
            expect(result).toEqual({ left: 0, right: 0, top: 0, bottom: 0 });
          });

          test("should handle negative coordinates correctly", () => {
            const bounds = [
              { left: -10, right: -5, top: -10, bottom: -5 },
              { left: -3, right: 3, top: -3, bottom: 3 },
              { left: -2, right: 2, top: -2, bottom: 2 },
            ];
            const result = SVGUtils.minBound(bounds);
            expect(result).toEqual({ left: -2, right: 2, top: -2, bottom: 2 });
          });
        });
      });
    });
  });
});