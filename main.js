document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  let numbers = document.getElementById('numbers');
  let operators = document.getElementById('operators');
  let number = document.createElement('button');
  let operator = document.createElement('button');
  number.classList.add('number');
  operator.classList.add('operator');
  let userInput = document.getElementById('user-input');
  let result = document.getElementById('result');
  let operate = document.getElementById('operate');
  let num, optr, multChar, divChar;
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const operatorList = ['+', '-', '/', '*', '^'];
  digits.forEach(digit => {
    num = number.cloneNode();
    num.innerHTML = digit.toString();
    numbers.append(num);
  });
  number.remove();
  operatorList.forEach(operation => {
    optr = operator.cloneNode();
    if (operation !== '/' && operation !== '*') {
      optr.innerHTML = operation;
    } else {
      if (operation === '/') {
	optr.innerHTML = '&divide;';
	divChar = optr.innerHTML;
      } else {
	optr.innerHTML = '&times;';
	multChar = optr.innerHTML;
      }
    }
    operators.append(optr);
  });
  operator.remove();
  let numberList = document.getElementsByClassName('number');
  for (let i = 0; i < numberList.length; i++) {
    numberList[i].addEventListener('click', insertToDisplay);
  }
  let operatorGroup = document.getElementsByClassName('operator');
  for (let i = 0; i < operatorGroup.length; i++) {
    operatorGroup[i].addEventListener('click', insertToDisplay);
  }
  disableOperators();
  function insertToDisplay(e) {
    e.preventDefault();
    // Check if the user-input display is empty
    if (userInput.innerHTML === "") {
      enableOperators();
    } else if (result.innerHTML === 'ERROR') {
      enableOperators();
      result.innerHTML = '';
    }
    userInput.innerHTML += this.innerHTML;
  }
  function enableOperators() {
    for (let i = 0; i < operatorGroup.length; i++) {
      operatorGroup[i].disabled = false;
    }
  }
  function disableOperators() {
    for (let i = 0; i < operatorGroup.length; i++) {
      operatorGroup[i].disabled = true;
    }
  }
  operate.addEventListener('click', e => {
    if (!validInput()) {
      result.innerHTML = 'ERROR';
      userInput.innerHTML = '';
      disableOperators();
      return;
    }
    e.preventDefault();
    let operands = obtainOperands(userInput.innerHTML);
    let operations = obtainOperations(userInput.innerHTML);
    let fullOperation = [];
    operands.forEach((value, index) => {
      fullOperation.push(value);
      if (operations[index]) {
        fullOperation.push(operations[index]);
      }
    });
    do {
      fullOperation = calculate(fullOperation);
    } while (fullOperation.length !== 1);
    result.innerHTML = fullOperation;
  });
  function validInput() {
    let operands = obtainOperands(userInput.innerHTML);
    let operations = obtainOperations(userInput.innerHTML);
    console.log(operands, operations);
    if ((operands.length - 1) !== operations.length) {
      return false;
    }
    return true;
  }
  function obtainOperands(inputFromUser) {
    inputFromUser = inputFromUser.split(/\D/);
    inputFromUser = inputFromUser.filter(foo => foo !== "");
    return inputFromUser;
  }
  function obtainOperations(inputFromUser) {
    inputFromUser = inputFromUser.split(/\d+/);
    inputFromUser = inputFromUser.filter(foo => foo !== "");
    return inputFromUser;
  }
  function calculate(operation) {
    // Should receive something like ["23", "x", "6"]
    // Want to do the operations in order
    // 1 -> Powers
    // 2 -> Divisions
    // 3 -> Products
    // 4 -> Subtractions
    // 5 -> Sums
    let power = operation.indexOf('^');
    let division = operation.indexOf(divChar);
    let product = operation.indexOf(multChar);
    let difference = operation.indexOf('-');
    let sum = operation.indexOf('+');
    let operandOne, operandTwo, result;
    if (power !== -1) {
      operandOne = operation[power - 1];
      operandTwo = operation[power + 1];
      result = giveItToMe(operandOne, operandTwo, '^');
      operation.splice(power - 1, 3, result);
      return operation;
    } else if (division !== -1) {
      operandOne = operation[division - 1];
      operandTwo = operation[division + 1];
      result = giveItToMe(operandOne, operandTwo, divChar);
      operation.splice(division - 1, 3, result);
      return operation;
    } else if (product !== -1) {
      operandOne = operation[product - 1];
      operandTwo = operation[product + 1];
      result = giveItToMe(operandOne, operandTwo, multChar);
      operation.splice(product - 1, 3, result);
      return operation;
    } else if (difference !== -1) {
      operandOne = operation[difference - 1];
      operandTwo = operation[difference + 1];
      result = giveItToMe(operandOne, operandTwo, '-');
      operation.splice(difference - 1, 3, result);
      return operation;
    } else if (sum !== -1) {
      operandOne = operation[sum - 1];
      operandTwo = operation[sum + 1];
      result = giveItToMe(operandOne, operandTwo, '+');
      operation.splice(sum - 1, 3, result);
      return operation;
    }
  }
  function giveItToMe(foo, bar, baz) {
    switch(baz) {
      case '^':
        return (parseFloat(foo) ** parseFloat(bar)).toString();
      case divChar:
        return (parseFloat(foo) / parseFloat(bar)).toString();
      case multChar:
        return (parseFloat(foo) * parseFloat(bar)).toString();
      case '-':
        return (parseFloat(foo) - parseFloat(bar)).toString();
      case '+':
        return (parseFloat(foo) + parseFloat(bar)).toString();
    }
  }
});
