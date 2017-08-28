'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = undefined;

/***********
Data: Customize the data below as you please.
***********/

const SKILL_NAME = "Personality Quiz";
const HELP_MESSAGE = "Answer five questions, and I will tell you what animal you are.";
const HELP_REPROMPT = "Your animal will be revealed after you answer my five yes or no questions.";
const STOP_MESSAGE = "Your spirit animal will be waiting for you next time.";
const CANCEL_MESSAGE = "Let's go back to the beginning.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Please answer with either yes or no.";

const WELCOME_MESSAGE = "Hi! I can tell you what animal you're most like. All you have to do is answer five questions with either yes or no. Are you ready to start?";
const QUESTION_INTROS = [
  "Fabulous!",
  "Alright.",
  "I would have said that too.",
  "Makes sense."
];
const RESULT_MESSAGE = "Congratulations! You are "; // the name of the result is inserted here.

const pokemonList = {
  pikachu: {
    name: "a Pikachu",
    audio_message: "Pikachus are pretty electric.",
    description: "Pikachus are pretty electric.",
    img: {
      smallImageUrl: "https://s-media-cache-ak0.pinimg.com/736x/f5/1d/08/f51d08be05919290355ac004cdd5c2d6--pikachu-tattoo-pikachu-drawing.jpg",
      largeImageUrl: "https://s-media-cache-ak0.pinimg.com/736x/f5/1d/08/f51d08be05919290355ac004cdd5c2d6--pikachu-tattoo-pikachu-drawing.jpg"
    }
  },
  snorlax: {
    name: "a Snorlax",
    audio_message: "You are generally rather boring.",
    description: "You are generally rather boring.",
    img: {
      smallImageUrl: "https://vignette3.wikia.nocookie.net/pokemon/images/9/9f/143Snorlax_OS_anime.png/revision/latest?cb=20140924022259",
      largeImageUrl: "https://vignette3.wikia.nocookie.net/pokemon/images/9/9f/143Snorlax_OS_anime.png/revision/latest?cb=20140924022259"
    }
  },
  mewtwo: {
    name: "a Mewtwo",
    audio_message: "You are strong and powerful.",
    description: "You are strong and powerful.",
    img: {
      smallImageUrl: "https://s-media-cache-ak0.pinimg.com/originals/e5/e7/1a/e5e71a159c81268f8e40838daa355fc2.png",
      largeImageUrl: "https://s-media-cache-ak0.pinimg.com/originals/e5/e7/1a/e5e71a159c81268f8e40838daa355fc2.png"
    }
  },
  charmander: {
    name: "a Charmander",
    audio_message: "You're hot!",
    description: "You're hot!",
    img: {
      smallImageUrl: "http://vignette4.wikia.nocookie.net/pokemon/images/5/55/004Charmander_OS_anime_3.png/revision/latest?cb=20150330015131",
      largeImageUrl: "http://vignette4.wikia.nocookie.net/pokemon/images/5/55/004Charmander_OS_anime_3.png/revision/latest?cb=20150330015131"
    }
  },
  squirtle: {
    name: "a Squirtle",
    audio_message: "You are athletic and cool.",
    description: "You are athletic and cool.",
    img: {
      smallImageUrl: "https://vignette2.wikia.nocookie.net/pokemon/images/1/15/007Squirtle_XY_anime.png/revision/latest?cb=20140916184418",
      largeImageUrl: "https://vignette2.wikia.nocookie.net/pokemon/images/1/15/007Squirtle_XY_anime.png/revision/latest?cb=20140916184418"
    }
  }
};

const questions = [
  {
    question: "Do you like people?",
    points: {
      pikachu: 4,
      snorlax: 1,
      mewtwo: 0,
      charmander: 2,
      squirtle: 3
    }
  },
  {
    question: "Do you like rocks?",
    points: {
      pikachu: 3,
      snorlax: 5,
      mewtwo: 4,
      charmander: 2,
      squirtle: 1
    }
  },
  {
    question: "Do you ever feel particularly powerful?",
    points: {
      pikachu: 4,
      snorlax: 0,
      mewtwo: 5,
      charmander: 3,
      squirtle: 2
    }
  },
  {
    question: "Does it make you happy to see things go up in flames?",
    points: {
      pikachu: 3,
      snorlax: 1,
      mewtwo: 2,
      charmander: 5,
      squirtle: 0
    }
  },
  {
    question: "Do you prefer vacation on the ocean?",
    points: {
      pikachu: 1,
      snorlax: 4,
      mewtwo: 3,
      charmander: 0,
      squirtle: 5
    }
  }
];

/***********
Execution Code: Avoid editing the code below if you don't know JavaScript.
***********/

// Private methods (this is the actual code logic behind the app)

const _initializeApp = handler => {
  // Set the progress to -1 one in the beginning
  handler.attributes['questionProgress'] = -1;
  // Assign 0 points to each pokemon
  var initialPoints = {};
  Object.keys(pokemonList).forEach(pokemon => initialPoints[pokemon] = 0);
  handler.attributes['pokemonPoints'] = initialPoints;
};

const _nextQuestionOrResult = handler => {
  if(handler.attributes['questionProgress'] >= (questions.length - 1)){
    handler.emitWithState('ResultIntent');
  }else{
    handler.emitWithState('NextQuestionIntent');
  }
};

const _applyPokemonPoints = (handler, calculate) => {
  const currentPoints = handler.attributes['pokemonPoints'];
  const pointsToAdd = questions[handler.attributes['questionProgress']].points;

  handler.attributes['pokemonPoints'] = Object.keys(currentPoints).reduce((newPoints, pokemon) => {
    newPoints[pokemon] = calculate(currentPoints[pokemon], pointsToAdd[pokemon]);
    return newPoints;
  }, currentPoints);
};

const _adder = (a, b) => a + b;
const _subtracter = (a, b) => a - b;

// Handle user input and intents:

const handlers = {
  'NewSession': function(){
    _initializeApp(this);

    this.emit(':tellWithCard', WELCOME_MESSAGE, SKILL_NAME, WELCOME_MESSAGE);
    //                         ^speechOutput,   ^cardTitle, ^cardContent,   ^imageObj
  },
  'NextQuestionIntent': function(){
    // Increase the progress of asked questions by one:
    this.attributes['questionProgress']++;

    // Store current question to read:
    var currentQuestion = questions[this.attributes['questionProgress']].question;
    var randomQuestionIntro = QUESTION_INTROS[Math.floor(Math.random() * QUESTION_INTROS.length)];
    this.emit(':askWithCard', `${randomQuestionIntro} ${currentQuestion}`, HELP_MESSAGE, SKILL_NAME, currentQuestion);
    //                        ^speechOutput                               ^repromptSpeech ^cardTitle ^cardContent     ^imageObj
  },
  'YesIntent': function(){
    // Apply points unless user answers whether to start the app:
    if(this.attributes['questionProgress'] > -1) _applyPokemonPoints(this, _adder);
    // Ask next question or return results when answering the last question:
    _nextQuestionOrResult(this);
  },
  'NoIntent': function(){
    if(this.attributes['questionProgress'] < 0){
      // User decided not to play
      this.emitWithState('AMAZON.StopIntent');
    }else{
      // User is responding to a given question
      _applyPokemonPoints(this, _subtracter);
      _nextQuestionOrResult(this);
    }
  },
  'ResultIntent': function(){
    // Determine the highest value:
    const pokemonPoints = this.attributes['pokemonPoints'];
    const result = Object.keys(pokemonPoints).reduce((o, i) => pokemonPoints[o] > pokemonPoints[i] ? o : i);
    const resultMessage = `${RESULT_MESSAGE} ${result.name}. ${result.audio_message}`;

    this.emit(':tellWithCard', resultMessage, SKILL_NAME, pokemonList[result].description, pokemonList[result].img);
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':askWithCard', HELP_MESSAGE, HELP_REPROMPT, SKILL_NAME);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tellWithCard', CANCEL_MESSAGE, SKILL_NAME, CANCEL_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tellWithCard', STOP_MESSAGE, SKILL_NAME, STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_INSTRUCTIONS_ANSWER);
  }
};



exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
