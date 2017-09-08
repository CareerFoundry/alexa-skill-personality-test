'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = undefined;

/***********
Data: Customize the data below as you please.
***********/

const SKILL_NAME = "Personality Quiz";
const HELP_MESSAGE_BEFORE_START = "Answer five questions, and I will tell you what animal you are. Are you ready to play?";
const HELP_MESSAGE_AFTER_START = "Just respond with yes or no and I'll give you the result in the end.";
const HELP_REPROMPT = "Your animal will be revealed after you answer all my yes or no questions.";
const STOP_MESSAGE = "Your spirit animal will be waiting for you next time.";
const CANCEL_MESSAGE = "Let's go back to the beginning.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Please answer with either yes or no.";

const WELCOME_MESSAGE = "Hi! I can tell you what animal you're most like. All you have to do is answer five questions with either yes or no. Are you ready to start?";
const INITIAL_QUESTION_INTROS = [
  "Great! Let's start!",
  "<say-as interpret-as='interjection'>Alrighty</say-as>! Here comes your first question!",
  "Ok let's go. <say-as interpret-as='interjection'>Ahem</say-as>.",
  "<say-as interpret-as='interjection'>well well</say-as>."
];
const QUESTION_INTROS = [
  "Oh dear.",
  "Okey Dokey",
  "You go, human!",
  "Sure thing.",
  "I would have said that too.",
  "Of course.",
  "I knew it.",
  "Totally agree.",
  "So true.",
  "I agree."
];
const UNDECISIVE_RESPONSES = [
  "<say-as interpret-as='interjection'>Honk</say-as>. I'll just choose for you.",
  "<say-as interpret-as='interjection'>Nanu Nanu</say-as>. I picked an answer for you.",
  "<say-as interpret-as='interjection'>Uh oh</say-as>... well nothing I can do about that.",
  "<say-as interpret-as='interjection'>Aha</say-as>. We will just move on then.",
  "<say-as interpret-as='interjection'>Aw man</say-as>. How about this question?",
];
const RESULT_MESSAGE = "Here comes the big reveal! You are "; // the name of the result is inserted here.
const PLAY_AGAIN_REQUEST = "That was it. Do you want to play again?";

const animalList = {
  starfish: {
    name: "a red-knobbed starfish",
    display_name: "Red-Knobbed Starfish",
    audio_message: "Starfish are amazing and can regrow their own limbs.",
    description: "Red-knobbed starfish are known for being the fashionistas of the salt water world. They always know how to look good in any circumstance. You might enjoy hanging around the edge of the pool and keeping an eye on everyone.",
    img: {
      smallImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Red-knobbed.starfish.720.jpeg",
      largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Red-knobbed.starfish.1200.jpg"
    }
  },
  rustmite: {
    name: "a rust mite",
    display_name: "Rust Mite",
    audio_message: "You are nearly invisible to the naked eye, but you aren't to be underestimated.",
    description: "Dear old Aceria anthocoptes. Small but mighty, you love hanging around outdoors and have an unnatural affinity for thistles. Don't let anyone hold you back - while people don't notice you at first, you can have a big impact on the things around you.",
    img: {
      smallImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Aceria_anthocoptes.720.jpeg",
      largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Aceria_anthocoptes.1200.jpg"
    }
  },
  macaw: {
    name: "a macaw",
    display_name: "Hyacinth Macaw",
    audio_message: "Macaws are smart and fabulous.",
    description: "Your striking appearance is the talk of every party. You are always the most colorfully dressed one around. You're also one smart cookie - you were using tools to make your tasks easier before it was cool.",
    img: {
      smallImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Anodorhynchus_hyacinthinus.720.jpg",
      largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Anodorhynchus_hyacinthinus.1200.jpg"
    }
  },
  goat: {
    name: "a goat",
    display_name: "Good Old Goat",
    audio_message: "Baaa! You are a goat.",
    description: "Goats are some of the most amazing animals on Earth. Constantly underestimated, they are nearly as impervious to other peoples' opinions as honey badgers. You are quite handy to have around, as you're always happy to take care of leftovers at any party.",
    img: {
      smallImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Male_goat.720.jpeg",
      largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Male_goat.1200.jpg"
    }
  },
  toad: {
    name: "a toad",
    display_name: "Toad",
    audio_message: "You dig relaxing and hanging around in the sunshine.",
    description: "You are athletic and cool, the apple of everyone's eye. You really know how to take it easy and like to spend lots of time basking in the sun and enjoying the great outdoors. When you want to, you can be quite fast and nimble. You're always the first pick for team sports.",
    img: {
      smallImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Bufo_boreas.720.jpeg",
      largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Bufo_boreas.1200.jpg"
    }
  }
};

const questions = [
  {
    question: "Do you like spending time socializing with others?",
    points: {
      starfish: 4,
      rustmite: 0,
      macaw: 5,
      goat: 3,
      toad: 1
    }
  },
  {
    question: "Do you enjoy sunbathing?",
    points: {
      starfish: 4,
      rustmite: 1,
      macaw: 2,
      goat: 3,
      toad: 5
    }
  },
  {
    question: "Do you enjoy reading a good book more than going out to a party?",
    points: {
      starfish: 0,
      rustmite: 5,
      macaw: 1,
      goat: 3,
      toad: 4
    }
  },
  {
    question: "Do you like doing sports?",
    points: {
      starfish: 2,
      rustmite: 3,
      macaw: 4,
      goat: 4,
      toad: 5
    }
  },
  {
    question: "Do you prefer vacationing in the forest instead of on the beach?",
    points: {
      starfish: 0,
      rustmite: 5,
      macaw: 3,
      goat: 4,
      toad: 5
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
  // Assign 0 points to each animal
  var initialPoints = {};
  Object.keys(animalList).forEach(animal => initialPoints[animal] = 0);
  handler.attributes['animalPoints'] = initialPoints;
};

const _nextQuestionOrResult = (handler, prependMessage = '') => {
  if(handler.attributes['questionProgress'] >= (questions.length - 1)){
    handler.handler.state = states.RESULTMODE;
    handler.emitWithState('ResultIntent', prependMessage);
  }else{
    handler.emitWithState('NextQuestionIntent', prependMessage);
  }
};

const _applyAnimalPoints = (handler, calculate) => {
  const currentPoints = handler.attributes['animalPoints'];
  const pointsToAdd = questions[handler.attributes['questionProgress']].points;

  handler.attributes['animalPoints'] = Object.keys(currentPoints).reduce((newPoints, animal) => {
    newPoints[animal] = calculate(currentPoints[animal], pointsToAdd[animal]);
    return newPoints;
  }, currentPoints);
};

const _randomQuestionIntro = handler => {
  if(handler.attributes['questionProgress'] == 0){
    // return random initial question intro if it's the first question:
    return _randomOfArray(INITIAL_QUESTION_INTROS);
  }else{
    // Assign all question intros to remainingQuestionIntros on the first execution:
    var remainingQuestionIntros = remainingQuestionIntros || QUESTION_INTROS;
    // randomQuestion will return 0 if the remainingQuestionIntros are empty:
    let randomQuestion = remainingQuestionIntros.splice(_randomIndexOfArray(remainingQuestionIntros), 1);
    // Remove random Question from rameining question intros and return the removed question. If the remainingQuestions are empty return the first question:
    return randomQuestion ? randomQuestion : QUESTION_INTROS[0];
  }
};

const _randomIndexOfArray = (array) => Math.floor(Math.random() * array.length);
const _randomOfArray = (array) => array[_randomIndexOfArray(array)];
const _adder = (a, b) => a + b;
const _subtracter = (a, b) => a - b;

// Handle user input and intents:

const states = {
  QUIZMODE: "_QUIZMODE",
  RESULTMODE: "_RESULTMODE"
}

const newSessionHandlers = {
  'NewSession': function(){
    _initializeApp(this);
    this.emit(':askWithCard', WELCOME_MESSAGE, SKILL_NAME, WELCOME_MESSAGE);
    //                         ^speechOutput,   ^cardTitle, ^cardContent,   ^imageObj
  },
  'YesIntent': function(){
    this.handler.state = states.QUIZMODE;
    _nextQuestionOrResult(this);
  },
  'NoIntent': function(){
    this.emitWithState('AMAZON.StopIntent');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':askWithCard', HELP_MESSAGE_BEFORE_START, HELP_REPROMPT, SKILL_NAME);
  },
  'AMAZON.CancelIntent': function(){
    this.emitWithState('AMAZON.StopIntent');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tellWithCard', STOP_MESSAGE, SKILL_NAME, STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_INSTRUCTIONS_ANSWER);
  }
};


const quizModeHandlers = Alexa.CreateStateHandler(states.QUIZMODE, {
  'NextQuestionIntent': function(prependMessage = ''){
    // Increase the progress of asked questions by one:
    this.attributes['questionProgress']++;
    // Reference current question to read:
    var currentQuestion = questions[this.attributes['questionProgress']].question;

    this.emit(':askWithCard', `${prependMessage} ${_randomQuestionIntro(this)} ${currentQuestion}`, HELP_MESSAGE_AFTER_START, SKILL_NAME, currentQuestion);
    //                        ^speechOutput                                                         ^repromptSpeech           ^cardTitle  ^cardContent     ^imageObj
  },
  'YesIntent': function(){
    _applyAnimalPoints(this, _adder);
    // Ask next question or return results when answering the last question:
    _nextQuestionOrResult(this);
  },
  'NoIntent': function(){
    // User is responding to a given question
    _applyAnimalPoints(this, _subtracter);
    _nextQuestionOrResult(this);
  },
  'UndecisiveIntent': function(){
    // Randomly apply
    Math.round(Math.random()) ? _applyAnimalPoints(this, _adder) : _applyAnimalPoints(this, _subtracter);
    _nextQuestionOrResult(this, _randomOfArray(UNDECISIVE_RESPONSES));
  },
  'AMAZON.RepeatIntent': function(){
    var currentQuestion = questions[this.attributes['questionProgress']].question;

    this.emit(':askWithCard', currentQuestion, HELP_MESSAGE_AFTER_START, SKILL_NAME, currentQuestion);
    //                        ^speechOutput    ^repromptSpeech           ^cardTitle ^cardContent     ^imageObj
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':askWithCard', HELP_MESSAGE_AFTER_START, HELP_REPROMPT, SKILL_NAME);
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
});


const resultModeHandlers = Alexa.CreateStateHandler(states.RESULTMODE, {
  'ResultIntent': function(prependMessage = ''){
    // Determine the highest value:
    const animalPoints = this.attributes['animalPoints'];
    const result = Object.keys(animalPoints).reduce((o, i) => animalPoints[o] > animalPoints[i] ? o : i);
    const resultMessage = `${prependMessage} ${RESULT_MESSAGE} ${animalList[result].name}. ${animalList[result].audio_message}. ${PLAY_AGAIN_REQUEST}`;

    this.emit(':askWithCard', resultMessage, PLAY_AGAIN_REQUEST, animalList[result].display_name, animalList[result].description, animalList[result].img);
    //                        ^speechOutput  ^repromptSpeech     ^cardTitle                       ^cardContent                    ^imageObj
  },
  'YesIntent': function(){
    _initializeApp(this);
    this.handler.state = states.QUIZMODE;
    _nextQuestionOrResult(this);
  },
  'NoIntent': function(){
    this.emitWithState('AMAZON.StopIntent');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':askWithCard', HELP_MESSAGE_AFTER_START, HELP_REPROMPT, SKILL_NAME);
  },
  'AMAZON.CancelIntent': function(){
    this.emitWithState('AMAZON.StopIntent');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tellWithCard', STOP_MESSAGE, SKILL_NAME, STOP_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_INSTRUCTIONS_ANSWER);
  }
});



exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(newSessionHandlers, quizModeHandlers, resultModeHandlers);
  alexa.execute();
};
