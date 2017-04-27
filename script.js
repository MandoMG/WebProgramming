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
      
      //returns an object with a value and locked state to act as a die
      makeDice = function () {
         return { 
            value: 1,
            locked: false
         }
      };
      
      //Create a default state
      state = {
         gameStarted: false,  //Has the game began
         gameFinished: false, //Has a winner been found
         numPlayers: 0,       //Number of player
         currentPlayer: 0,    //Who is trying to score
         numRounds: 0,        //How many total rounds have elapsed
         scoreSheet: [],      //Store the scores
         rollsRemain: 0,      //How many rolls does the current player have left
         dice: []             //Store the dice
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
         //Function that takes in a number of players and initializes a game
         startGame: function (playerCount) {
            //Only start a new game if there isn't a current game going //NOTE: MIGHT NEED TO CHANGE
            if( playerCount >= 1 ) {
               //Which player we're on and dice counter
               var whichPlayer, numDice;
               
               //Set numPlayers to the number of players
               state.numPlayers = playerCount;
               
               //Reset the scoresheet
               state.scoreSheet = [];
               //Reset the dice
               state.dice = [];
               //Reset numRounds
               state.numRounds = 0;
               //Reset the currentPlayer
               state.currentPlayer = 0;
               //The game isn't done
               state.gameFinished = false;
               state.gameStarted = false;
               
               //For each of the players, generate them a row in the score table filled with -1
               for (whichPlayer = 0; whichPlayer < playerCount; whichPlayer += 1) {
                  state.scoreSheet[whichPlayer] = Array(13).fill(-1);
               }
               //Fill state.dice with new dice
               for (numDice = 0; numDice < 5; numDice += 1) {
                  state.dice[numDice] = makeDice();
               }
               //Players start with 3 rolls
               state.rollsRemain = 3;
               //Roll their first dice
               self.roll ();
               //Set the game to started
               state.gameStarted = true;
               //console.log(JSON.stringify(state.scoreSheet));
               //console.log(JSON.stringify(state.dice));
            }
         },
         //Rolls the dice
         roll: function () {
            //If the game hasn't finished and there are rolls remaining
            if(!state.gameFinished && state.rollsRemain > 0) {
               //For each fo the dice
               state.dice.forEach(function (die) {
                  //If it hasn't been locked
                  if(!die.locked) {
                     //Roll a random int from 1=6. inclusive
                     die.value = (Math.floor(Math.random() * 6) + 1);
                  }
               });
               //Reduce the number of rolls this player has left
               state.rollsRemain -= 1;
            }
         },
         //Toggles the locked state of a die
         lockDie: function (dieNum) {
            state.dice[dieNum].locked = !state.dice[dieNum].locked;
         },
         score: function (scoreType) { //scoreType should be an integer from 0-12, in the order the categories are on the scoresheet
            var dieResults, hasScored, scoreValue, threeFound, twoFound, straightSize;
            //If the game is over don't allow any more scoring
            if (state.gameFinished) {
               return false;
            }
               
            //set hasScored and scoreValue to defaults
            hasScored = false;
            scoreValue = 0;
            //No dice have been counted yet
            dieResults = Array(6).fill(0);
            
            //Add up the number of each die value in the set
            state.dice.forEach(function (die) {
               dieResults[die.value - 1] += 1;
            });
            //Check to see if the score is available for the current player (and not trying to score yahtzee), if not then return false
            if(state.scoreSheet[state.currentPlayer][scoreType] >= 0 && scoreType != 12) {
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
                     //If a yahtzee has already been scored, and wasn't 0, then check to see if the player has played in the corresponding top section
                     if (state.scoreSheet[state.currentPlayer][scoreType] >= 50 && state.scoreSheet[state.currentPlayer][whichDie] > 0) {
                        //If a second yahtzee has been scored, then score 100 more points in the yahtzee category
                        scoreValue = 100 + state.scoreSheet[state.currentPlayer][scoreType];
                     }
                  }
               });
               //If no second yahtzee was scored return from the function without doing anything
               if(state.scoreSheet[state.currentPlayer][scoreType] >= 50 && scoreValue <= 50) {
                  return hasScored;
               }
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
               //Reset the number of rolls
               state.rollsRemain = 3;
               //Roll the dice for the next player
               self.roll();
            }
            //console.log(JSON.stringify(state.scoreSheet));
         },
         getWinner: function () {   //Returns an object containing the winning player and their score
            var sum, bestScore, bestPlayer
            //Set to default values
            bestScore = -1;
            bestPlayer = -1;
            //For each player
            state.scoreSheet.forEach(function (player, whichPlayer) {
               //Reset sum and then add the scores for this player together
               sum = 0;
               player.forEach(function (score) {
                  sum += score;
               });
               //If sum is larger than bestScore, save sum into bestScore and save bestPlayer
               if (sum > bestScore) {
                  bestScore = sum;
                  bestPlayer = whichPlayer;
               }
            });
            //Return object with score and winner
            return {
               score: bestScore,
               winner: bestPlayer
            };
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
         var scoreSheetOutputElement, scoreOutputElement, categoryButtonElements, currentPlayerOutputElement, winner;
         //If local storage exists and we can save the game to it, then do so
         if (localStorage && localStorage.setItem) {
            localStorage.setItem('CS 3312 Final YahtzeeGame', yahtzeeGame.getState());
         }
         
         //Update the text on the rollButton to show the number of remaining rolls
         rollButton.textContent = 'Roll! (' + yahtzeeGame.getRolls() + ')';
         
         //Get the categoryButtons
         categoryButtonElements = Array.prototype.slice.call(document.querySelectorAll('#scoreSelectors > li'));
         
         //If the game is in progress, we need to update stuff
         if (yahtzeeGame.hasGameStarted()) {
            //Turn on the game
            document.querySelector('.dice-holder').classList.remove('hidden');
            document.querySelector('.scoring-sheet').classList.remove('hidden');
            document.querySelector('.category-select').classList.remove('hidden');
            
            //For each dice image element refresh the image of the dice, and if it is locked display a different image
            Array.prototype.slice.call(document.querySelectorAll('.yahtzee-dice div > img')).forEach(function (die, index) {
               die.src = 'images\/dice' + yahtzeeGame.getDice()[index].value + (yahtzeeGame.getDice()[index].locked ? 'sel' : '') + '.png';
            });
            
            //Update the submitButtons and the score buttons
            categoryButtonElements.forEach(function (button, whichButton) {
               //Remove classes from the submit buttons
               button.classList.remove('disabled','selected');
               //If the corresponding score for the current player and this button exists (and isn't yahtzee), then disable the button
               if (yahtzeeGame.getScores()[yahtzeeGame.getCurrentPlayer()][whichButton] >= 0 && whichButton != 12) {
                  button.classList.add('disabled');
               //Else if the button is the selected category, highlight it
               } else if (whichButton === selectedCategory) {
                  button.classList.add('selected');
               }
            });
            
            //Get the current player div
            currentPlayerOutputElement = document.querySelector('#currentPlayer');
            
            //Get the scoresheet div
            scoreSheetOutputElement = document.querySelector('#players-table');
            //If the game isn't over
            if (!yahtzeeGame.isGameOver()) {
               //Update the title bar with the current player
               currentPlayerOutputElement.textContent = 'Player ' + (yahtzeeGame.getCurrentPlayer() + 1) + '\'s Turn';
            } else {
               //Else the game is over, so output the winner and their score total
               winner = yahtzeeGame.getWinner();
               currentPlayerOutputElement.textContent = 'Player ' + (winner.winner + 1) + ' wins with ' + (winner.score) + ' points!';
            }

            //Remove all of the elements in the scoreSheet
            while (scoreSheetOutputElement.hasChildNodes()) {
               scoreSheetOutputElement.removeChild(scoreSheetOutputElement.firstChild);
            }
            
            //For each player in the scores
            yahtzeeGame.getScores().forEach(function (player, index) {
               //Insert a table into the scoreSheetOutputElement with an id of player#
               scoreSheetOutputElement.insertAdjacentHTML('beforeend', '<table id="player' + (index + 1) + '" >');
               //Retrieve the newly created table
               scoreOutputElement = document.querySelector('#player'+(index+1));
               //Insert a row containing the player's name
               scoreOutputElement.insertAdjacentHTML('beforeend', '<tr> <th> Player ' + (index + 1) + '</td>');
               //For each score
               player.forEach(function (score, whichScore) {
                  //If the category has been scored in
                  if(score >= 0) {
                     //Display the numberical score
                     scoreOutputElement.insertAdjacentHTML('beforeend', '<tr> <td> ' + (score) + '</td> </tr>');
                  //Else the category has not been score in
                  } else {
                     //So output dashes insted of a number
                     scoreOutputElement.insertAdjacentHTML('beforeend', '<td> --- </td> ');
                  }
                  //If the score is 6's, then we need to separate the pper and lower sections
                  if (whichScore === 5) {
                     //Output a blank line
                     scoreOutputElement.insertAdjacentHTML('beforeend', '<tr> <td></br></td>');
                  }
               });
               //End the table for this player
               scoreSheetOutputElement.insertAdjacentHTML('beforeend', '</table>');
            });
         } else if (!yahtzeeGame.hasGameStarted()) {
            
         }
            

      };
      
      //If a user enters an out of bounds number, then correct it
      document.querySelector('#playerNum').addEventListener('input', function () {
         var playerNumInputElement;
         playerNumInputElement = document.querySelector('#playerNum');
         //
         if(parseInt(playerNumInputElement.value, 10) > 8) {
            playerNumInputElement.value = '8';
         } else if (parseInt(playerNumInputElement.value, 10) < 1) {
            playerNumInputElement.value = '1';
         }
      });
      
      //When the start button is clicked, read in the number of players and create a new game with it
      document.querySelector('#start-button').addEventListener('click', function () {
         var playerNumInputElement;
         //Get the player number input box
         playerNumInputElement = document.querySelector('#playerNum');
         //Start the game with the given number of players
         yahtzeeGame.startGame(parseInt(playerNumInputElement.value, 10));
         //Reset the input value
         playerNumInputElement.value = '';
         updateView();
      });      
      
      //When the reset button is pressed, clear local storage
      document.querySelector('#reset-button').addEventListener('click', function () {
         localStorage.removeItem('CS 3312 Final YahtzeeGame');
         console.log('local storage cleared');
      });
      
      //Assign the rollButton to a variable
      rollButton = document.querySelector('#RollButton');
      
      //Add a click listener to the rollbutton that calls the roll function of the game, and then updates the view
      rollButton.addEventListener('click', function () {
         yahtzeeGame.roll();
         //console.log(JSON.stringify(yahtzeeGame.getDice()));
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
            //Save the category and update the view
            selectedCategory = whichSelector;
            updateView();
         });
      });
      
      //When the Submit button is clicked, call the score() function with the given selectedCategory, and then reset selectedCategory
      document.querySelector('#submitButton').addEventListener('click', function () {
         //console.log(yahtzeeGame.getCurrentPlayer());
         //If the score category is valid (0-12)
         if (selectedCategory >= 0 && selectedCategory <= 12) {
            //Try to score and then update the board
            yahtzeeGame.score(selectedCategory);   //Update category
            selectedCategory = -1;                 //Reset the selected scoring box
            updateView();                          //Update the view
         }
         //console.log(yahtzeeGame.isGameOver());
      });
      
      //Create a new game; if local storage exists and a game is stored, then retrieve the stored version
      yahtzeeGame = createYahtzeeGame(localStorage && localStorage.getItem && localStorage.getItem('CS 3312 Final YahtzeeGame'));
      //yahtzeeGame.startGame(2);
      selectedCategory = -1;
      updateView();
   }());
   
}, false);
