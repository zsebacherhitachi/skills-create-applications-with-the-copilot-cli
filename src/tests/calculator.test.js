const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const test = require("node:test");
const { calculate } = require("../calculator");

test("addition", async (t) => {
  const examples = [
    { left: 2, right: 3, expected: 5 },
    { left: 0, right: 0, expected: 0 },
    { left: -4, right: 9, expected: 5 },
    { left: 1.25, right: 2.5, expected: 3.75 },
  ];

  for (const { left, right, expected } of examples) {
    await t.test(`${left} + ${right} = ${expected}`, () => {
      assert.equal(calculate(left, "+", right), expected);
    });
  }
});

test("subtraction", async (t) => {
  const examples = [
    { left: 10, right: 4, expected: 6 },
    { left: 0, right: 0, expected: 0 },
    { left: 3, right: 8, expected: -5 },
    { left: 5.5, right: 2.25, expected: 3.25 },
  ];

  for (const { left, right, expected } of examples) {
    await t.test(`${left} - ${right} = ${expected}`, () => {
      assert.equal(calculate(left, "-", right), expected);
    });
  }
});

test("multiplication", async (t) => {
  const examples = [
    { left: 45, right: 2, expected: 90 },
    { left: 0, right: 12, expected: 0 },
    { left: -3, right: 4, expected: -12 },
    { left: 1.5, right: 2, expected: 3 },
  ];

  for (const { left, right, expected } of examples) {
    await t.test(`${left} * ${right} = ${expected}`, () => {
      assert.equal(calculate(left, "*", right), expected);
    });
  }
});

test("division", async (t) => {
  const examples = [
    { left: 20, right: 5, expected: 4 },
    { left: 0, right: 5, expected: 0 },
    { left: -12, right: 3, expected: -4 },
    { left: 7.5, right: 2.5, expected: 3 },
  ];

  for (const { left, right, expected } of examples) {
    await t.test(`${left} / ${right} = ${expected}`, () => {
      assert.equal(calculate(left, "/", right), expected);
    });
  }
});

test("division by zero throws a clear error", () => {
  assert.throws(() => calculate(20, "/", 0), {
    message: "Cannot divide by zero.",
  });
  assert.throws(() => calculate(20, "/", -0), {
    message: "Cannot divide by zero.",
  });
});

test("rejects unsupported operations", () => {
  assert.throws(
    () => calculate(2, "%", 3),
    /Unsupported operation "%".*Use \+, -, \*, or \//,
  );
});

test("rejects non-finite and non-number operands", async (t) => {
  const invalidOperands = [NaN, Infinity, -Infinity, "2", null, undefined];

  for (const operand of invalidOperands) {
    await t.test(`rejects ${String(operand)}`, () => {
      assert.throws(() => calculate(operand, "+", 1), {
        message: "Both operands must be valid finite numbers.",
      });
      assert.throws(() => calculate(1, "+", operand), {
        message: "Both operands must be valid finite numbers.",
      });
    });
  }
});

test("CLI prints the result for an operation", () => {
  const result = spawnSync(
    process.execPath,
    [require.resolve("../calculator"), "2", "+", "3"],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "2 + 3 = 5");
  assert.equal(result.stderr, "");
});

test("CLI reports division by zero and exits unsuccessfully", () => {
  const result = spawnSync(
    process.execPath,
    [require.resolve("../calculator"), "20", "/", "0"],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /Error: Cannot divide by zero\./);
});
