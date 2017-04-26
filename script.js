/*jslint browser: true, indent: 3 */

// CS 3312, spring 2017
// Final Project
// YOUR NAME(S): Armando Meza, Jacob Hallenberger

// All the code below will be run once the page content finishes loading.
document.addEventListener('DOMContentLoaded', function () {
   'use strict';   
   
   //Will hold the function used to make a game
   var createYahtzeeGame;
   
   
   
   createYahtzeeGame = function (savedState) {
      var self, state, makeDice;
      
      makeDice = function () {
         return { 
            value: 1,
            locked: false
         }
      };
      
      //Create a default state
      state = {
         gameStarted: false,
         gameFinished: false,
         numPlayers: 0,
         currentPlayer: 0,
         numRounds: 0,
         scoreSheet: [],
         rollsRemain: 0,
         dice: []
      };
      
      //If savedState is a string it might be a saved game, so try to parse it
      if (typeof savedState === 'string') {
         try {
            state = JSON.parse(savedState);
         } catch (ignore) {
         }
      }
      
      //Self contains the public methods
      self = {
         hasGameStarted: function () {return state.gameStarted},
         isGameOver: function () {return state.gameFinished},
         getCurrentPlayer: function () {return state.currentPlayer},
         getScores: function () {return state.scoreSheet},
         getDice: function () {return state.dice},
         startGame: function (playerCount) {
            var whichPlayer, numDice;
            
            state.numPlayers = playerCount;
            
            for (whichPlayer = 0; whichPlayer < playerCount; whichPlayer += 1) {
               state.scoreSheet[whichPlayer] = Array(13).fill(-1);
            }
            
            for (numDice = 0; numDice < 5; numDice += 1) {
               state.dice[numDice] = makeDice();
            }
            self.roll ();
            
            state.rollsRemain = 3;
            
            state.gameStarted = true;
            console.log(JSON.stringify(state.scoreSheet));
            console.log(JSON.stringify(state.dice));
         },
         roll: function () {
            if(!state.gameFinished && state.rollsRemain > 0) {
               state.dice.forEach(function (die) {
                  if(!die.locked) {
                     die.value = (Math.floor(Math.random() * 6) + 1);
                  }
               });
               state.rollsRemain -= 1;
            }
         },
         lockDie: function (dieNum) {
            state.dice[dieNum].locked = !state.dice[dieNum].locked;
         }
      };
      //TEST
      self.startGame(3);
      return self;
   };
   
   //Variable declaration
   var rollButton, diceImg, game, gameDice;
   
   game = createYahtzeeGame(55);
   
   rollButton = document.querySelector('#RollButton');
   
   rollButton.addEventListener('click', function () {
      game.roll();
      console.log(JSON.stringify(game.getDice()));
      /*gameDice = game.getDice();
      gameDice[1].locked = true;
      diceImg = Array.prototype.slice.call(document.querySelectorAll('.yahtzee-dice div > img'));
      diceImg.forEach(function (value, index) {
         value.src = 'images\/dice' + gameDice[index].value + (gameDice[index].locked ? 'sel' : '') + '.png';
      });*/
   });
   /*var rollDice = function () {
      var dieElements;      

      //Create array of the imgs within the #yahtzee-dice element      
      diceImg = Array.prototype.slice.call(document.querySelectorAll('.yahtzee-dice div > img'));
      
      diceImg.forEach(function (value, index) {
         value.src = 'images\/dice' + (Math.floor(Math.random() * 6) + 1) + '.png';
      });
   };
   
   rollButton.addEventListener('click', function () {
      rollDice();*/
   //});
}, false);
