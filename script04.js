/*jslint browser: true, indent: 3 */

// CS 3312, spring 2017
// Studio 4
// YOUR NAME(S): Armando Meza, Jacob Hallenberger

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';

   // Add your JavaScript code here.
   
   //F to C
   document.querySelector('#convert-f-to-c').addEventListener('click', function () {
      //variables for Temperature converters.
      var fahr, fahrVal, celsius, celsVal;
      // Get all output elements
      fahr = document.querySelector('#fahrenheit');
      celsius = document.querySelector('#celsius');
      
      fahrVal = parseFloat(fahr.value);
      celsVal = (fahrVal - 32) * (5/9)
      
      celsius.value = celsVal.toFixed(4);            
   }, false);
   
   //C to F
   document.querySelector('#convert-c-to-f').addEventListener('click', function () {
      //variables for Temperature converters.
      var fahr, fahrVal, celsius, celsVal;
      // Get all output elements
      fahr = document.querySelector('#fahrenheit');
      celsius = document.querySelector('#celsius');

      celsVal = parseFloat(celsius.value);
      fahrVal = (celsVal * (9/5)) + 32;
     
      fahr.value = fahrVal.toFixed(4);            
   }, false);
   
   document.querySelector('#draw-star-box').addEventListener('click', function () {
      for(){
         for(){
         }
      }
   }, false);   
   
}, false);