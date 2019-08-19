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
  let clearBtn = document.getElementById('clear');
  let deleteBtn = document.getElementById('delete');
  let header = document.querySelector('header');
  let footer = document.querySelector('footer');
  let main = document.querySelector('main');
  main.style.minHeight = (document.body.offsetHeight -
    (header.offsetHeight + footer.offsetHeight)) + 'px';
  document.body.style.paddingBottom = footer.offsetHeight + 'px';
  clearBtn.disabled = true;
  deleteBtn.disabled = true;
  operate.disabled = true;
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const operatorList = ['+', '-', '/', '*', '^'];
  digits.forEach(digit => {
    num = number.cloneNode();
    num.innerHTML = digit.toString();
    numbers.append(num);
  });
  num = number.cloneNode();
  num.innerHTML = '.';
  numbers.append(num);
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
    if (userInput.innerHTML === "") {
      enableOperators();
      enableDisplayManagers();
    }
    if (result.innerHTML !== '') {
      if (result.innerHTML === 'ERROR') {
        result.innerHTML = '';
      } else {
        switch (e.target.classList[0]) {
          case 'number':
            userInput.innerHTML = '';
            result.innerHTML = '';
            break;
          case 'operator':
            userInput.innerHTML = result.innerHTML;
            result.innerHTML = '';
            break;
        }
      }
    }
    enableOperators();
    enableDisplayManagers();
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
  operate.addEventListener('click', doTheOperation);
  clearBtn.addEventListener('click', clearDisplay);
  deleteBtn.addEventListener('click', deleteCharacter);
  function clearDisplay() {
    disableOperators();
    result.innerHTML = '';
    userInput.innerHTML = '';
    disableDisplayManagers();
  }
  function deleteCharacter() {
    let newUserInput = userInput.innerHTML.split('');
    newUserInput.pop();
    newUserInput = newUserInput.join('');
    userInput.innerHTML = newUserInput;
    if (userInput.innerHTML === '') {
      disableDisplayManagers();
      disableOperators();
    }
  }
  function doTheOperation() {
    if (!validInput()) {
      result.innerHTML = 'ERROR';
      userInput.innerHTML = '';
      disableOperators();
      operate.disabled = true;
      deleteBtn.disabled = true;
      return;
    }
    let operands = obtainOperands(userInput.innerHTML);
    let operations = obtainOperations(userInput.innerHTML);
    if (operations.length === 0) {
      if (operands[0] === '.') {
        result.innerHTML = '0';
        operate.disabled = true;
        deleteBtn.disabled = true;
        return
      }
      result.innerHTML = operands[0];
      operate.disabled = true;
      deleteBtn.disabled = true;
      return;
    }
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
    if (fullOperation.includes(NaN)) {
      result.innerHTML = 'ERROR';
      userInput.innerHTML = '';
      operate.disabled = true;
      deleteBtn.disabled = true;
      disableOperators();
      return;
    }
    result.innerHTML = fullOperation;
    if (allZeros(result.innerHTML)) {
      result.innerHTML = parseInt(result.innerHTML).toString();
    }
    operate.disabled = true;
    deleteBtn.disabled = true;
  }
  function disableDisplayManagers() {
    operate.disabled = true;
    clearBtn.disabled = true;
    deleteBtn.disabled = true;
  }
  function enableDisplayManagers() {
    operate.disabled = false;
    clearBtn.disabled = false;
    deleteBtn.disabled = false;
  }
  function validInput() {
    let operands = obtainOperands(userInput.innerHTML);
    let operations = obtainOperations(userInput.innerHTML);
    if ((operands.length - 1) !== operations.length) {
      return false;
    }
    return true;
  }
  function obtainOperands(inputFromUser) {
    // 169440385390243.9×4 <-- test case, TODO
    inputFromUser = inputFromUser.split('');
    // should be ["1", "6", ..., ".", "9", "×", "4"]
    let operatorStrings = ['+', '-', '^', multChar, divChar];
    let result = [];
    let tempArr = [];
    inputFromUser.forEach((value, index) => {
      if (operatorStrings.includes(value) && inputFromUser[index - 1] !== 'e') {
        result.push(tempArr.join(''));
        tempArr = [];
      } else {
        tempArr.push(value);
        if (index === inputFromUser.length - 1) {
          result.push(tempArr.join(''));
        }
      }
    });
    result = result.filter(a => a !== '');
    return result;
  }
  function obtainOperations(inputFromUser) {
    let a = inputFromUser.split('');
    let b = [];
    let f = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e', '.'];
    a.forEach((d, e) => {
      if (f.includes(d) || a[e - 1] === 'e') {
        return;
      }
      b.push(d);
    });
    return b;
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
      if (operandTwo === '0') {
        result = NaN;
        operation.splice(division - 1, 3, result);
        return operation;
      }
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
        return (parseFloat(foo) ** parseFloat(bar)).toFixed(3).toString();
      case divChar:
        return (parseFloat(foo) / parseFloat(bar)).toFixed(3).toString();
      case multChar:
        return (parseFloat(foo) * parseFloat(bar)).toFixed(3).toString();
      case '-':
        return (parseFloat(foo) - parseFloat(bar)).toFixed(3).toString();
      case '+':
        return (parseFloat(foo) + parseFloat(bar)).toFixed(3).toString();
    }
  }
  function allZeros(str) {
    if (str.includes('.')) {
        str = str.split('.');
        if (str[1] === '000') {
          return true;
        } else {
          return false;
        }
    }
    return true;
  }
  window.addEventListener('keydown', e => {

    switch (e.keyCode) {
      case 48:
        if (result.innerHTML !== '') {
          userInput.innerHTML = '';
          result.innerHTML = '';
        }
        userInput.innerHTML += '0';
        enableOperators();
        enableDisplayManagers();
        break;
      case 49:
        if (result.innerHTML !== '') {
          userInput.innerHTML = '';
          result.innerHTML = '';
        }
        userInput.innerHTML += '1';
        enableOperators();
        enableDisplayManagers();
        break;
      case 50:
        if (result.innerHTML !== '') {
          userInput.innerHTML = '';
          result.innerHTML = '';
        }
        userInput.innerHTML += '2';
        enableOperators();
        enableDisplayManagers();
        break;
      case 51:
        if (result.innerHTML !== '') {
          userInput.innerHTML = '';
          result.innerHTML = '';
        }
        userInput.innerHTML += '3';
        enableOperators();
        enableDisplayManagers();
        break;
      case 52:
        if (result.innerHTML !== '') {
          userInput.innerHTML = '';
          result.innerHTML = '';
        }
        userInput.innerHTML += '4';
        enableOperators();
        enableDisplayManagers();
        break;
      case 53:
        if (result.innerHTML !== '') {
          userInput.innerHTML = '';
          result.innerHTML = '';
        }
        userInput.innerHTML += '5';
        enableOperators();
        enableDisplayManagers();
        break;
      case 54:
        if (result.innerHTML !== '') {
          userInput.innerHTML = '';
          result.innerHTML = '';
        }
        userInput.innerHTML += '6';
        enableOperators();
        enableDisplayManagers();
        break;
      case 55:
        if (e.key === '/') {
          e.preventDefault();


          if (result.innerHTML !== '') {
            userInput.innerHTML = result.innerHTML;
            result.innerHTML = '';
          }
          userInput.innerHTML += divChar;
        } else {
          if (result.innerHTML !== '') {
            userInput.innerHTML = '';
            result.innerHTML = '';
          }
          userInput.innerHTML += '7';
          enableOperators();
          enableDisplayManagers();
        }
        break;
      case 56:
        if (result.innerHTML !== '') {
          userInput.innerHTML = '';
          result.innerHTML = '';
        }
        userInput.innerHTML += '8';
        enableOperators();
        enableDisplayManagers();
        break;
      case 57:
        if (result.innerHTML !== '') {
          userInput.innerHTML = '';
          result.innerHTML = '';
        }
        userInput.innerHTML += '9';
        enableOperators();
        enableDisplayManagers();
        break;
      case 190:
        if (result.innerHTML !== '') {
          userInput.innerHTML = '';
          result.innerHTML = '';
        }
        userInput.innerHTML += '.';
        enableOperators();
        enableDisplayManagers();
        break;
      case 88:
        if (result.innerHTML !== '') {
          userInput.innerHTML = result.innerHTML;
          result.innerHTML = '';
        }
        userInput.innerHTML += multChar;
        break;
      case 0:
        if (e.code === 'BracketLeft') {
          if (result.innerHTML !== '') {
            userInput.innerHTML = result.innerHTML;
            result.innerHTML = '';
          }
          userInput.innerHTML += '^';
        }
        break;
      case 171:
      case 107:
        if (result.innerHTML !== '') {
          userInput.innerHTML = result.innerHTML;
          result.innerHTML = '';
        }
        userInput.innerHTML += '+';
        break;
      case 109:
      case 173:
        if (result.innerHTML !== '') {
          userInput.innerHTML = result.innerHTML;
          result.innerHTML = '';
        }
        userInput.innerHTML += '-';
        break;
      case 13:
        doTheOperation();
        break;
      case 8:
        deleteCharacter();
        break;
      case 67:
        clearDisplay();
        break;
    }
  });
});
