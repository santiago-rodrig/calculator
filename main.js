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
  let num, optr;
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
      optr.innerHTML = operation === '/' ? '&divide;' : '&times;';
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
    if (userInput.innerText === "") {
      enableOperators();
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
    e.preventDefault();
    let operands = obtainOperands(userInput.innerHTML);
    let operations = obtainOperations(userInput.innnerHTML);
    let magicArray = []; // Everything is better with magic
  });
  function obtainOperands(inputFromUser) {
    return inputFromUser.split(/\+|-|&times;|&divide;|\^/);
  }
  function obtainOperations(inputFromUser) {
    inputFromUser = inputFromUser.split(/\d/);
    inputFromUser = inputFromUser.filter(foo => foo !== "");
    return inputFromUser
  }
});
