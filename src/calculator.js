#!/usr/bin/env node

function assertFiniteOperands(left, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error("Both operands must be valid finite numbers.");
  }
}

function modulo(a, b) {
  assertFiniteOperands(a, b);
  if (b === 0) {
    throw new Error("Cannot calculate modulo by zero.");
  }
  return a % b;
}

function power(base, exponent) {
  assertFiniteOperands(base, exponent);
  return base ** exponent;
}

function squareRoot(n) {
  if (!Number.isFinite(n)) {
    throw new Error("The input must be a valid finite number.");
  }
  if (n < 0) {
    throw new Error("Cannot calculate the square root of a negative number.");
  }
  return Math.sqrt(n);
}

function calculate(left, operator, right) {
  assertFiniteOperands(left, right);

  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      if (right === 0) {
        throw new Error("Cannot divide by zero.");
      }
      return left / right;
    case "%":
      return modulo(left, right);
    case "^":
      return power(left, right);
    default:
      throw new Error(`Unsupported operation "${operator}". Use +, -, *, /, %, or ^.`);
  }
}

function main(args) {
  if (args[0] === "--help" || args[0] === "-h") {
    console.log("Usage: node src/calculator.js <number> <operator> <number>");
    console.log("       node src/calculator.js sqrt <number>");
    console.log("Supported operators: +, -, *, /, %, ^, sqrt");
    return;
  }

  const isSquareRoot = args[0] === "sqrt";
  if ((isSquareRoot && args.length !== 2) || (!isSquareRoot && args.length !== 3)) {
    console.error("Usage: node src/calculator.js <number> <operator> <number>");
    console.error("       node src/calculator.js sqrt <number>");
    process.exitCode = 1;
    return;
  }

  const leftText = isSquareRoot ? args[1] : args[0];
  const operator = isSquareRoot ? "sqrt" : args[1];
  const rightText = isSquareRoot ? undefined : args[2];
  const left = Number(leftText);
  const right = isSquareRoot ? undefined : Number(rightText);

  try {
    if (leftText.trim() === "" || (!isSquareRoot && rightText.trim() === "")) {
      throw new Error("Both operands must be valid finite numbers.");
    }
    const result = isSquareRoot ? squareRoot(left) : calculate(left, operator, right);
    console.log(isSquareRoot ? `sqrt ${left} = ${result}` : `${left} ${operator} ${right} = ${result}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { calculate, modulo, power, squareRoot };
