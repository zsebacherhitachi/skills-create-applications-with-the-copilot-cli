#!/usr/bin/env node

// Supported operations: addition (+), subtraction (-), multiplication (*), and division (/).
function calculate(left, operator, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error("Both operands must be valid finite numbers.");
  }

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
    default:
      throw new Error(`Unsupported operation "${operator}". Use +, -, *, or /.`);
  }
}

function main(args) {
  if (args[0] === "--help" || args[0] === "-h") {
    console.log("Usage: node src/calculator.js <number> <operator> <number>");
    console.log("Supported operators: +, -, *, /");
    return;
  }

  if (args.length !== 3) {
    console.error("Usage: node src/calculator.js <number> <operator> <number>");
    process.exitCode = 1;
    return;
  }

  const [leftText, operator, rightText] = args;
  const left = Number(leftText);
  const right = Number(rightText);

  try {
    if (leftText.trim() === "" || rightText.trim() === "") {
      throw new Error("Both operands must be valid finite numbers.");
    }
    const result = calculate(left, operator, right);
    console.log(`${left} ${operator} ${right} = ${result}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { calculate };
