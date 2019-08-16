document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  let numbers = document.getElementById('numbers');
  let operators = document.getElementById('operators');
  let number = document.createElement('button');
  let operator = document.createElement('button');
  number.classList.add('number');
  operator.classList.add('operator');
  let userInput = document.getElementById('user-input');
  let num, optr;
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const operatorList = ['+', '-', '/', 'x', '^'];
  digits.forEach(digit => {
    num = number.cloneNode();
    num.innerText = digit.toString();
    numbers.append(num);
  });
  number.remove();
  operatorList.forEach(operation => {
    optr = operator.cloneNode();
    optr.innerText = operation;
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
  function insertToDisplay(e) {
    e.preventDefault();
    userInput.innerText += this.innerText;
  }
});
