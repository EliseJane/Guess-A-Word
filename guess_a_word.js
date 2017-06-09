(function() {
  var wordSpace = document.getElementById('spaces');
  var letterSpaces = wordSpace.getElementsByTagName('span');
  var guessSpaces = document.getElementById('guesses');
  var allSpaces = document.getElementsByTagName('span');
  var message = document.getElementById('message');
  var apples = document.getElementById('apples');
  var startOver = document.getElementsByTagName('a')[0];

  var randomWord = (function() {
    var words = ['abacus', 'quotient', 'xeroma', 'octothorpe', 'proselytize', 'stipend', 'defenestrate'];
    
    return function() {
      var index = Math.floor(Math.random() * words.length);
      return words.splice(index, 1)[0];
    };
  })();

  var Game = {
    maxApples: 6,
    reset: function() {
      apples.className = null;
      document.body.className = null;
      Array.from(allSpaces).forEach(function(space) {
        space.remove();
      });
      startOver.textContent = null;
      this.displayMessage('');
    },
    newGame: function() {
      this.reset();
      this.word = randomWord();
      if (this.word) {
        this.correct = 0;
        this.incorrect = 0;
        this.guesses = [];
        this.setSpaces();
        var that = this;
        this.handler = function(e) {
          that.checkLetter(e.which);
        };
        document.addEventListener('keypress', this.handler);
      } else {
        this.displayMessage('Sorry, I\'ve run out of words!');
      }
      return this;
    },
    setSpaces: function() {
      for (var i = 0; i < this.word.length; i++) {
        wordSpace.appendChild(document.createElement('span'));
      }
    },
    displayMessage: function(text) {
      message.textContent = text;
    },
    checkLetter: function(key) {
      if (this.isLetter(key)) {
        var letter = String.fromCharCode(key);
        
        if (!this.guesses.includes(letter)) {
          this.guesses.push(letter);
          this.updateGuesses(letter);
          
          if(this.word.includes(letter)) {
            this.revealLetters(letter);
          } else {
            this.incorrect++;
            this.updateTree();
          }
        }
      }
    },
    isLetter: function(code) {
      return code >= 97 && code <= 122;
    },
    revealLetters: function(letter) {
      for (var i = 0; i < this.word.length; i++) {
        if (this.word[i] === letter) {
          letterSpaces[i].textContent = letter;
          this.correct++;
        }
      }
      if (this.correct === this.word.length) {
        this.displayMessage('You guessed the word!');
        document.body.className = 'win';
        this.endGame();
      }
    },
    updateTree: function() {
      apples.className = ("guess_" + String(this.incorrect));
      if (this.incorrect === this.maxApples) {
        this.displayMessage('You are out of guesses.');
        document.body.className = 'lose';
        this.endGame();
      }
    },
    updateGuesses: function(key) {
      var guess = document.createElement('span');
      guess.textContent = key;
      guessSpaces.appendChild(guess);
    },
    endGame: function() {
      document.removeEventListener('keypress', this.handler);

      startOver.textContent = 'I wanna play again!';
    },
  };

  var game = Object.create(Game).newGame();

  startOver.addEventListener('click', function(e) {
    e.preventDefault();
    game = Object.create(Game).newGame();
  });
})();