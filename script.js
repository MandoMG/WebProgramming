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
         getRolls: function () {return state.rollsRemain},
         getState: function () {return JSON.stringify(state)},
         startGame: function (playerCount) {
            if(!state.gameStarted) {
               var whichPlayer, numDice;
               
               state.numPlayers = playerCount;
               
               for (whichPlayer = 0; whichPlayer < playerCount; whichPlayer += 1) {
                  state.scoreSheet[whichPlayer] = Array(13).fill(-1);
               }
               
               for (numDice = 0; numDice < 5; numDice += 1) {
                  state.dice[numDice] = makeDice();
               }
               state.rollsRemain = 3;
               self.roll ();
               state.gameStarted = true;
               console.log(JSON.stringify(state.scoreSheet));
               console.log(JSON.stringify(state.dice));
            }
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
         },
         score: function (scoreType) { //scoreType should be an integer from 0-12, in the order the categories are on the scoresheet
            var dieResults, hasScored, scoreValue, threeFound, twoFound, straightSize;
            //set hasScored and scoreValue to defaults
            hasScored = false;
            scoreValue = 0;
            //No dice have been counted yet
            dieResults = Array(6).fill(0);
            
            //Add up the number of each die value in the set
            state.dice.forEach(function (die) {
               dieResults[die.value - 1] += 1;
            });
            //Check to see if the score is available for the current player, if not then return false
            if(state.scoreSheet[state.currentPlayer][scoreType] >= 0) {
               return hasScored;
            }
            
            if (scoreType === 0) {           //Ones
               scoreValue = dieResults[0];
               hasScored = true;
            } else if (scoreType === 1) {    //Twos
               scoreValue = dieResults[1] * 2;
               hasScored = true;
            } else if (scoreType === 2) {    //Threes
               scoreValue = dieResults[2] * 3;
               hasScored = true;
            } else if (scoreType === 3) {    //Fours
               scoreValue = dieResults[3] * 4;
               hasScored = true;
            } else if (scoreType === 4) {    //Fives
               scoreValue = dieResults[4] * 5;
               hasScored = true;
            } else if (scoreType === 5) {    //Sixs
               scoreValue = dieResults[5] * 6;
               hasScored = true;
            } else if (scoreType === 6) {    //3 of a Kind
               //Look for any set of 3 dice in the results, and if found then score
               dieResults.forEach(function (dieCount, whichDie) {
                  scoreValue += ((whichDie + 1) * dieCount);
                  if (dieCount >= 3) {
                     hasScored = true;
                  }
               });
               //If they haven't scored, reset scoreValue
               if (!hasScored) {
                  scoreValue = 0;
               }
            } else if (scoreType === 7) {    //4 of a Kind
               //Look for any set of 4 dice in the results, and if found then score
               dieResults.forEach(function (dieCount, whichDie) {
                  scoreValue += ((whichDie + 1) * dieCount);
                  if (dieCount >= 4) {
                     hasScored = true;
                  }
               }); 
               //If they haven't scored, reset scoreValue
               if (!hasScored) {
                  scoreValue = 0;
               }
            } else if (scoreType === 8) {    //Full House
               threeFound = false;
               twoFound = false;
               //Look through the dice and if a set of 2 and a set of 3 are found, then score 25 pts
               dieResults.forEach(function (dieCount, whichDie) {
                  if (dieCount === 2) {
                     twoFound = true;
                  } else if (dieCount === 3) {
                     threeFound = true;
                  }
                  
                  if (threeFound && twoFound) {
                     scoreValue = 25;
                     hasScored = true;
                  }
               }); 
            } else if (scoreType === 9) {    //Small Straight
               straightSize = 0;
               //Counts up the dice
               dieResults.forEach(function (dieCount, whichDie) {
                  //Add 1 to straightSize for every nonzero dice group in a row
                  if (dieCount > 0) {
                     straightSize += 1;
                  } else {
                     straightSize = 0;
                  }
                  //If 4 nonzero dice groups are found in a row, then score
                  if (straightSize >= 4) {
                     scoreValue = 30;
                     hasScored = true;
                  }
               });
            } else if (scoreType === 10) {   //Large Straight
               straightSize = 0;
               //Counts up the dice
               dieResults.forEach(function (dieCount, whichDie) {
                  //Add 1 to straightSize for every nonzero dice group in a row
                  if (dieCount > 0) {
                     straightSize += 1;
                  } else {
                     straightSize = 0;
                  }
                  //If 5 nonzero dice groups are found in a row, then score
                  if (straightSize === 5) {
                     scoreValue = 40;
                     hasScored = true;
                  }
               });
            } else if (scoreType === 11) {   //Chance
               //Sum up all of the dice
               dieResults.forEach(function (dieCount, whichDie) {
                  scoreValue += (dieCount * (whichDie + 1));
               });
               hasScored = true;
            } else if (scoreType === 12) {   //Yahtzee
               //If a set of 5 same numbers exists, then a yahtzee is scored
               dieResults.forEach(function (dieCount, whichDie) {
                  if (dieCount === 5) {
                     scoreValue = 50;
                     hasScored = true;
                  }
               });
            }
            
            //If no valid score was made, then return without doing anything else
            /*if (!hasScored) {
               return hasScored;
            }*/
            
            //Otherwise a successful score was made, and so the game needs to be updated
            
            //Update the scoreSheet with the new score
            state.scoreSheet[state.currentPlayer][scoreType] = scoreValue;
            
            //Go to the next player
            state.currentPlayer = (state.currentPlayer + 1) % state.numPlayers;
            
            //If the current player is back to 0, increment the round
            if (state.currentPlayer === 0) {
               state.numRounds += 1;
            }
            
            //If the final round has been reached, then the game is over
            if (state.numRounds === 13) {
               state.gameFinished = true;
            } else { //Else the next player needs to have their dice reset
               //Unlock the dice
               state.dice.forEach(function (die) {
                  die.locked = false;
               });
               state.rollsRemain = 3;
               self.roll();
            }
            console.log(JSON.stringify(state.scoreSheet));
         }
      };
      //TEST
      //self.startGame(3); //will make a new game every time
      return self;
   };
   
   //iffie to hold the view and controller portions of the game
   (function () {
      //Variable declaration
      var updateView, rollButton, diceImg, yahtzeeGame, gameDice, selectedCategory;
      
      //Updates the page and saves the game
      updateView = function () {
         var scoreSheetOutputElement, scoreOutputElement, categoryButtonElements, submitButtonElement;
         //If local storage exists and we can save the game to it, then do so
         if (localStorage && localStorage.setItem) {
            localStorage.setItem('CS 3312 Final YahtzeeGame', yahtzeeGame.getState());
         }
         
         //For each dice image element refresh the image of the dice, and if it is locked display a different image
         Array.prototype.slice.call(document.querySelectorAll('.yahtzee-dice div > img')).forEach(function (die, index) {
            die.src = 'images\/dice' + yahtzeeGame.getDice()[index].value + (yahtzeeGame.getDice()[index].locked ? 'sel' : '') + '.png';
         });
         
         //Update the text on the rollButton to show the number of remaining rolls
         rollButton.textContent = 'Roll! (' + yahtzeeGame.getRolls() + ')';
         
         //Get the categoryButtons and the submit button
         categoryButtonElements = Array.prototype.slice.call(document.querySelectorAll('#scoreSelectors > li'));
         
         //Update the submitButtons and the score buttons
         categoryButtonElements.forEach(function (button, whichButton) {
            //Remove classes from the submit buttons
            button.classList.remove('disabled','selected');
            //If the score for the current player exists, then disable the button
            if (yahtzeeGame.getScores()[yahtzeeGame.getCurrentPlayer()][whichButton] >= 0) {
               button.classList.add('disabled');
               //Else if the button is the selected category, hilight it
            } else if (whichButton === selectedCategory) {
               button.classList.add('selected');
            }
         });
         
         //Get the scoresheet div
         scoreSheetOutputElement = document.querySelector('#players-table');
         
         //Remove all of the elements in the scoreSheet
         while (scoreSheetOutputElement.hasChildNodes()) {
            scoreSheetOutputElement.removeChild(scoreSheetOutputElement.firstChild);
         }
         
         //If the game is in progress and is not over, then refresh the scores
         if(yahtzeeGame.hasGameStarted() && !yahtzeeGame.isGameOver()) {
            yahtzeeGame.getScores().forEach(function (player, index) {
               scoreSheetOutputElement.insertAdjacentHTML('beforeend', '<table id="player' + (index + 1) + '" >');
               scoreOutputElement = document.querySelector('#player'+(index+1));
               scoreOutputElement.insertAdjacentHTML('beforeend', '<tr> <th> Player ' + (index + 1) + '</td>');
               player.forEach(function (score, whichScore) {
                  if(score >= 0) {
                     scoreOutputElement.insertAdjacentHTML('beforeend', '<tr> <td> ' + (score) + '</td> </tr>');
                  } else {
                     scoreOutputElement.insertAdjacentHTML('beforeend', '<td> --- </td> ');
                  }
                  
                  if (whichScore === 5) {
                     scoreOutputElement.insertAdjacentHTML('beforeend', '<tr> <td></br></td>');
                  }
               });
               scoreSheetOutputElement.insertAdjacentHTML('beforeend', '</table>');
               
            });
         }

         //console.log(yahtzeeGame.hasGameStarted());
         //console.log(yahtzeeGame.isGameOver());
         //For e
      };
      
      //Assign the rollButton to a variable
      rollButton = document.querySelector('#RollButton');
      
      //Add a click listener to the rollbutton that calls the roll function of the game, and then updates the view
      rollButton.addEventListener('click', function () {
         yahtzeeGame.roll();
         console.log(JSON.stringify(yahtzeeGame.getDice()));
         updateView();
      });
      
      //For every dice image, add a click listener that toggles the locked state of the dice, and then updates the view
      Array.prototype.slice.call(document.querySelectorAll('.yahtzee-dice div > img')).forEach(function (die, index) {
         die.addEventListener('click', function () {
            yahtzeeGame.getDice()[index].locked = !(yahtzeeGame.getDice()[index].locked);
            updateView();
         });
      });
      
      //For every score type button, give it a click listener that saves the score type when clicked
      Array.prototype.slice.call(document.querySelectorAll('#scoreSelectors > li')).forEach(function (selector, whichSelector) {
         selector.addEventListener('click', function () {
            selectedCategory = whichSelector;
            updateView();
         });
      });
      
      //When the Submit button is clicked, call the score() function with the given selectedCategory, and then reset selectedCategory
      document.querySelector('#submitButton').addEventListener('click', function () {
         console.log(yahtzeeGame.getCurrentPlayer());
         //If the score category is valid (0-12)
         if (selectedCategory >= 0 && selectedCategory <= 12) {
            //Try to score and then update the board
            yahtzeeGame.score(selectedCategory);
            selectedCategory = -1;
            updateView();
         }
         console.log(yahtzeeGame.isGameOver());
      });
      
      
      //Create a new game; if local storage exists and a game is stored, then retrieve the stored version
      yahtzeeGame = createYahtzeeGame(localStorage && localStorage.getItem && localStorage.getItem('CS 3312 Final YahtzeeGame'));
      yahtzeeGame.startGame(2);
      selectedCategory = -1;
      updateView();
   }());
   
}, false);
