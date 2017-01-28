"use strict";
let isInit, calcDone, syntaxErr;

// just (MDAS) for now
// next version: Parentheses and Exponents

const chainCalculate = (operation) => {
  const operationRes = [
    /\d+(\.?)(\d+?)\×\d+(\.)?(\d+)?/g,
    /\d+(\.?)(\d+?)\÷\d+(\.)?(\d+)?/g,
    /\d+(\.?)(\d+?)\+\d+(\.)?(\d+)?/g,
    /\d+(\.?)(\d+?)\-\d+(\.)?(\d+)?/g];

  for (let i = 0; i < operationRes.length; i++) {
    if (operation.match(operationRes[i])) {
      let currentOperation = operation.match(operationRes[i])[0];
      return chainCalculate(operation.replace(currentOperation, calculate(currentOperation)));
    }
  }
  return operation;
};


// clear screen if C and inits the calculation if not
const init = function (option) {
  if (!option) {
    /* if the init is called without an argument
      it is considered to be a clearing command
      thus now it's cleared and the calculation
      is not initialized */

    $(".display").text("0.");
    isInit = false;
  } else if (option == "Syntax Error!") {
    $(".display").text(option);
    syntaxErr = true;
  } else {
    /* if an option is provided however,
      it inits the calculator with that option
      passed to the function */

    $(".display").text(option);
    isInit = true;
  }
};

// appends operators or operands
const appendOp = function (op) {
  const display = $(".display").text();
  $(".display").text(display + op);
};

const calculate = function (operation) {

  // basic operations add, subtract, multiply, and divide
  const numberify = (a) => {
    return +a;
  };
  const operationFuns = [
    (a, b) => {
      return a + b;
    },
    (a, b) => {
      return a - b;
    },
    (a, b) => {
      return a * b;
    },
    (a, b) => {
      return a / b;
    }
    ];

  // ye know =D
  const operatorRes = [/\+/g, /\-/g, /\×/g, /\÷/g];

  // detects floating point issues
  const isLargeFloat = (number) => {
    if (number.toString().length > 8 && number.toString().indexOf(".") < 8) {
      return true;
    }
    return false;
  };

  // matching the regex found with the appropriate operation
  for (let i = 0; i < operationFuns.length; i++) {
    if (operatorRes[i].test(operation)) {
      operation = operation.split(operatorRes[i]);
      operation = operation.map(numberify).reduce(operationFuns[i]);
      if (isLargeFloat(operation)) {
        operation = operation.toFixed(2);
        if (operation.split(".")[1].match(/^0+/g) > 0) {
          operation = parseInt(operation);
        }
      }
    }
  }
  return operation;
};

$(".btn").click(function () {
  if (syntaxErr) {
    init();
    syntaxErr = false;
  }
});

$(".calculate").click(function () {
  let operation = $(".display").text();
  if (/\D{2,}/g.test(operation)) {
    init("Syntax Error!");
    return false;
  }
  init(chainCalculate(operation));
  calcDone = true;
});

$(".clear").click(function () {
  init();
});

$(".delete").click(function () {
  let display = $(".display").text();
  if (display.length == 1 || display == "0.") {
    init();
    return false;
  }
  display = display.split("").slice(0, display.length - 1).join("");
  $(".display").text(display);
});

$(".number, .dot, .operation").click(function () {
  const opClass = "operation btn btn-default",
    dotClass = "dot btn btn-default";
  if (this.className != opClass && calcDone) {
    init(this.innerHTML);
    calcDone = false;
    if (this.className == dotClass) {
      init("0" + this.innerHTML);
    }
  } else {
    calcDone = false;
    let that = this;
    if (isInit) {
      appendOp(that.innerHTML);
    } else {
      init(that.innerHTML);
    }
  }
});
