/*jslint browser: true, indent: 3 */

// CS 3312, spring 2017
// Studio 5
// YOUR NAME(S): Jacob Hallenberger, Armando Meza

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';
   var fibonacci, isPrime, rememberTotal, reverseString;

   isPrime = function (num) {
      //Variables for use within isPrime
      var div;

      //If the number is less than two or not a number, it can't be prime
      if (num < 2 || isNaN(num)) {
         return false;
      }

      //Else loop through all values from 2 to the ceiling of the square root of num to check primality
      //Used https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
      for (div = 2; div <= Math.ceil(Math.sqrt(num)); div += 1) {
         //If div divides num, it isn't prime
         if (num % div === 0) {
            return false;
         }
      }
      //Otherwise num is prime
      return true;
   };

   (function () {
      var report;

      report = function (num) {
         //Variable to hold output box
         var outputElement;
         //Assign output box
         outputElement = document.querySelector('#prime-or-not');

         //If the value is not a finite number, output 'not a number'
         if (!isFinite(num) || isNaN(num)) {
            outputElement.textContent = 'not a number';
         } else if (isPrime(num)) { //If num is prime, output 'prime', else output 'not prime'
            outputElement.textContent = 'prime';
         } else {
            outputElement.textContent = 'not prime';
         }

      };

      // Call the report function even before there's a value to use.
      report();
      // When the number is changed at all, immediately . . .
      document.querySelector('#primality-input').addEventListener('input', function () {
         // . . . call the report function and pass it the user's value.
         report(parseInt(document.querySelector('#primality-input').value, 10));
      }, false);
   }());

   fibonacci = function fibonacci(n) {
      //If n is infinite or negative, return 0
      if (!isFinite(n) || n < 0) {
         return 0;
      } else { //Else n is finite and nonnegative, so continue
         //If n < 2, return n as a base case
         if (n < 2) {
            return n;
         } else { //Else recursively call fibonacci
            return (fibonacci(n - 2) + fibonacci(n - 1));
         }
      }
   };

   // Do things when the "Calculate it" button is clicked.
   document.querySelector('#calculate-fibonacci').addEventListener('click', function () {
      var whichFibonacciNumber;
      // Get the user's number.
      whichFibonacciNumber = parseInt(document.querySelector('#fibonacci-input').value, 10);
      // Use the fibonacci function to calculate the output.
      document.querySelector('#which-fibonacci-number').textContent = whichFibonacciNumber.toString();
      document.querySelector('#fibonacci-number').textContent = fibonacci(whichFibonacciNumber).toString();
   }, false);

   rememberTotal = (function () {
      //Variable to hold the accumulator total
      var total;
      total = 0;  //Initialize to 0
      //return a function that adds num to total given num is a finite number
      return function (num) {
         //If num isn't a finite number, don't change total
         if (!isFinite(num) || isNaN(num)) {
            return total;
         } else { //else add num onto total
            total += num;
            return total;
         }
      };
   }());

   // Output the initial total.
   document.querySelector('#total-number').textContent = rememberTotal();
   // Update and output the total whenever the "Add it to the total" button is clicked.
   document.querySelector('#add-to-total').addEventListener('click', function () {
      rememberTotal(parseFloat(document.querySelector('#number-input').value));
      document.querySelector('#total-number').textContent = rememberTotal();
   }, false);

   reverseString = function reverseString(str) {
      //If string is not a string or has a length of 0, then return the empty string
      if (typeof str !== 'string' || str.length === 0) {
         return '';
      } else { //Else reverse the string and return it
         return str.charAt(str.length-1) + reverseString(str.slice(0,str.length-1));
      }
   };

   (function () {
      var reversalInputElement;
      reversalInputElement = document.querySelector('#reversal-input');
      // When the user changes the string and focuses on another part of the page, reverse the new string.
      // Notice the difference between the 'change' event and the 'input' event.
      reversalInputElement.addEventListener('change', function () {
         reversalInputElement.value = reverseString(reversalInputElement.value);
      }, false);
   }());

   (function () {
      // If you like, write code here that will change the color of the square when the mouse interacts with it.
      // You may find the updateSquare function from the examples useful.
   }());

}, false);
