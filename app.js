// Fully functional PEMDAS calculator !!
"use strict";

// Codepen fix ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

if (typeof window.CP !== "object") {
  window.CP = {};
  window.CP.shouldStopExecution = () => {return false};
}

// Booleans ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
let isInit, calcDone, syntaxErr;

// regexes ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
const operationRes = [
  /\((\-)?\d+(\.)?(\d+)?\D(\-)?\d+(\.)?(\d+)?\)/g,
  /(\-)?\d+(\.)?(\d+)?\^(\-)?\d+(\.)?(\d+)?/g,
  /(\-)?\d+(\.)?(\d+)?\×(\-)?\d+(\.)?(\d+)?/g,
  /(\-)?\d+(\.)?(\d+)?\÷(\-)?\d+(\.)?(\d+)?/g,
  /(\-)?\d+(\.)?(\d+)?\+(\-)?\d+(\.)?(\d+)?/g,
  /(\-)?\d+(\.)?(\d+)?\-(\-)?\d+(\.)?(\d+)?/g
];


// functions ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
//
// numberify(number)
// takes an string argument and returns the number equivalent
// negative string numbers like "-1" are converted to their
// negative equivalent without any modifications
const numberify = number => {return +number;};
const power = (number, exponent) => {
  if (exponent == 0) {
    return 1;
  }
  return number * power(number, exponent -1);
};
const parenProcess = (operation) => {
  return chainCalculate(operation.replace(/\(|\)/g, ""));
};
const operationFuns = [
  power,
  (a, b) => {return a * b;},
  (a, b) => {return a / b;},
  (a, b) => {return a + b},
  (a, b) => {return a - b;}
];

//
// isLargeFloat(number)
// detects floating point issues
const isLargeFloat = number => {
  number = number.toString();
  if (number.length > 8 &&
     number.indexOf(".") < 8 &&
     number.indexOf(".") > 2) {
    return true;
  }
  return false;
};

//
// chainCalculate(operation)
// performs recursive calculation if there is more than one operator
// PEMDAS in mind
// goes through the regexes to detect
// Parentheses, Exponentiation, Multiplication,
// Division, Addition, or Subtraction in order.
// After it finds one of the operations
// it sends them to the calculate function for processing
// then it replaces the result with the operation it has
// processed
// if no more operations regexes were detected the loop is
// bypassed and the return statement executes
const chainCalculate = operation => {
  for (let i = 0; i < operationRes.length; i++) {
    if (operation.match(operationRes[i])) {
      let currentOperation = operation.match(operationRes[i])[0];
      return chainCalculate(operation
        .replace(currentOperation, calculate(currentOperation)));
    }
  }
  return operation;
};

//
// init(option)
// clear screen if C and inits the calculation if not
// if the init is called without an argument
// it is considered to be a clearing command
// thus now it's cleared and the calculation
// is not initialized
// if an option is provided however,
// it inits the calculator with that option
// passed to the function
// it can also handle syntax errors
const init = option => {
  if (!option) {
    $(".display").text("0.");
    isInit = false;
  } else if (option == "Syntax Error!") {
    $(".display").text(option);
    syntaxErr = true;
  } else {
    $(".display").text(option);
    isInit = true;
  }
};

//
// appendOp
// appends operators or operands
const appendOp = op => {
  const display = $(".display").text();
  if (display.length > 15) {
    return false;
  }
  $(".display").text(display + op);
};


//
// calculate
// the calculate function is ready to
// process one operation at a time
// it is a dependency of the
// chainCalculate function
const calculate =  operation => {
  const operatorRes = [/\^/g ,/\×/g, /\÷/g, /\+/g, /\-/g];
  if (operationRes[0].test(operation)) {
    return parenProcess(operation);
  }
  for (let i = 0; i < operationFuns.length; i++) {
    if (operatorRes[i].test(operation)) {
      operation = operation.split(operatorRes[i]);
      operation = operation.map(numberify)
      .reduce(operationFuns[i]);
      if (isLargeFloat(operation)) {
        operation = operation.toFixed(2);
        if (operation.split(".")[1].match(/^0+/g) > 0) {
          operation = parseInt(operation);
          return operation;
        }
        return operation;
      }
      return operation;
    }
  }
};

const isValidOp = operation => {
  if (((operation.indexOf("(") == -1) && (operation.indexOf(")")!= -1)) ||
  (((operation.indexOf("(") != -1) && (operation.indexOf(")") == -1)))) {
    return false;
  }
  if (/(\-|\+|\×|\÷){2,}/g.test(operation)) {
    return false;
  }
  if (/^\d+\(\d+\)$/g.test(operation)) {
    return false;
  }
  return true;
};

// event handlers ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
$(".btn").click(function () {
  if (syntaxErr) {
    init();
    syntaxErr = false;
  }
});

$(".calculate").click(function () {
  let operation = $(".display").text();
  if (!isValidOp(operation)) {
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
  if (calcDone) {
    init();
    return false;
  }
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

// keyboard integration
$(document).on("keypress", function(e) {
  let key = String.fromCharCode(e.which);
  const entries = [".", "+", "-", "*", "/", "=", "(", ")", "^"];
  const entriesIds = ["dot", "add", "sub", "mul", "div", "cal", "lp", "rp", "pow"];
  if (e.which == 13) {
    $("#cal").click();
    return false;
  }
  if (entries.indexOf(key) !== -1) {
    $(`#${entriesIds[entries.indexOf(key)]}`).click();
  } else if (/\d/g.test(key)) {
    $(`#${key}`).click();
  }
});

$(document).on("keydown", function (e) {
  if (e.which == 8) {
    $(".delete").click();
    return false;
  }
});
