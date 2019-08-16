document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  let numbers = document.getElementById('numbers');
  let operators = document.getElementById('operators');
  let number = document.createElement('button');
  let num;
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  digits.forEach(digit => {
    num = number.cloneNode();
    num.innerText = digit.toString();
    numbers.append(num);
  });
  number.remove();
});
