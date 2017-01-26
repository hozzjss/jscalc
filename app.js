"use strict";
let isInit, operandExists, calcDone;

// clear the screen if C is clicked and inits the
// calculation
const init = function (option) {
  if (!option) {
    $(".display").text("0.");
    isInit = false;
    operandExists = false;
  } else {
    $(".display").text(option);
    isInit = true;
  }
};

const appendOp = function (op) {
  const display = $(".display").text();
  if (!/\d|\./.test(op) && !operandExists){
    $(".display").text(display + " " + op + " ");
    operandExists = true;
  } else if (/\d|\./.test(op)) {
    $(".display").text(display + op);
  }
};

const calculate = function (operation) {
  const numberify = (a) => {return +a;};
  const add = (a,b) => {return a + b;};
  const subtract = (a,b) => {return a - b;};
  const multiply = (a,b) => {return a * b;};
  const divide = (a,b) => {
    if (a % b === 0)
      return a / b;
    else
      return (a / b).toFixed(4);
  };
  operation = operation.replace(/\s/g,"")
  const operators = [/\+/g, /\-/g, /\×/g, /\÷/g];
  if (operators[0].test(operation)){
    operation = operation.split("+");
    operation = operation.map(numberify).reduce(add);
  } else if (operators[1].test(operation)) {
    operation = operation.split("-");
    operation = operation.map(numberify).reduce(subtract);
  } else if (operators[2].test(operation)) {
    operation = operation.split("×");
    operation = operation.map(numberify).reduce(multiply);
  } else if (operators[3].test(operation)) {
    operation = operation.split("÷");
    operation = operation.map(numberify).reduce(divide);
  }
  return operation;
};

$(".calculate").click(function () {
  let operation = $(".display").text();
  operation = calculate(operation);
  init(operation);
  operandExists = false;
  calcDone = true;
});

$(".clear").click(function () {
  init();
});

$(".number, .dot, .operation").click(function () {
  if (this.className != "operation btn btn-default"
      && calcDone) {
        init(this.innerHTML);
        calcDone = false;
        if (this.className == "dot btn btn-default") {
          init("0" + this.innerHTML);
        }
  }
  else {
    calcDone = false;
    let that = this;
    if(isInit) {
      appendOp(that.innerHTML);
    } else {
      init(that.innerHTML);
    }
  }
});
