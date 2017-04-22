/*jslint browser: true, indent: 3 */

// CS 3312, spring 2017
// Final Project
// YOUR NAME(S): Armando Meza, Jacob Hallenberger

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';   
   
   //Variable declaration
   var rollButton, diceImg;
   
   rollButton = document.querySelector('#RollButton');
   
   var rollDice = function () {
      var dieElements;      

      //Create array of the imgs within the #yahtzee-dice element      
      diceImg = Array.prototype.slice.call(document.querySelectorAll('.yahtzee-dice div > img'));
      
      diceImg.forEach(function (value, index) {
         value.src = 'dice' + (Math.floor(Math.random() * 6) + 1) + '.png';
      });
   };
   
   rollButton.addEventListener('click', function () {
      rollDice();
   });
}, false);
