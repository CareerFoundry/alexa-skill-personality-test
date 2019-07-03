'use strict';
const Alexa = require('ask-sdk');
const Util = require('util.js');

/***********
Data: Customize the data below as you please.
***********/


const SKILL_NAME = "Personality Quiz";
const HELP_MESSAGE_BEFORE_START = "Answer five questions, and I will tell you what animal you are. Are you ready to play?";
const HELP_MESSAGE_AFTER_START = "Just respond with yes or no and I'll give you the result in the end.";
const HELP_REPROMPT = "Your animal will be revealed after you answer all my yes or no questions.";
const STOP_MESSAGE = "Your spirit animal will be waiting for you next time.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Please answer with either yes or no.";


// const imgUrl = (imgName) => Util.getS3PreSignedUrl("Media/"+imgName);
const BACKGROUND_IMAGE_URL = "https://voiceprototyping.com/cf/default.jpg";
const BACKGROUND_GOODBYE_IMAGE_URL = "https://voiceprototyping.com/cf/goodbye.jpg";
const BACKGROUND_HELP_IMAGE_URL = "https://voiceprototyping.com/cf/help.jpg";

const WELCOME_MESSAGE = "Hi! I can tell you what animal you're most like. All you have to do is answer five questions with either yes or no. Are you ready to start?";
const INITIAL_QUESTION_INTROS = [
  "Great! Let's start!",
  "<say-as interpret-as='interjection'>Alrighty</say-as>! Here comes your first question!",
  "Ok lets go. <say-as interpret-as='interjection'>Ahem</say-as>.",
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
const RESULT_MESSAGE_SHORT = "You are "; // the name of the result is inserted here.
const PLAY_AGAIN_REQUEST = "That was it. Do you want to play again?";

const animalList = {
  starfish: {
    name: "a red-knobbed starfish",
    display_name: "Red-Knobbed Starfish",
    audio_message: "Starfish are amazing and can regrow their own limbs.",
    description: "Red-knobbed starfish are known for being the fashionistas of the salt water world. They always know how to look good in any circumstance. You might enjoy hanging around the edge of the pool and keeping an eye on everyone.",
    img: {
      largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Red-knobbed.starfish.1200.jpg"
      //largeImageUrl: imgUrl("result1.jpg"),
    }
  },
  rustmite: {
    name: "a rust mite",
    display_name: "Rust Mite",
    audio_message: "You are nearly invisible to the naked eye, but you aren't to be underestimated.",
    description: "Dear old Aceria anthocoptes. Small but mighty, you love hanging around outdoors and have an unnatural affinity for thistles. Don't let anyone hold you back - while people don't notice you at first, you can have a big impact on the things around you.",
    img: {
      
      largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Aceria_anthocoptes.1200.jpg"
      //largeImageUrl: imgUrl("result2.jpg"),
    }
  },
  macaw: {
    name: "a macaw",
    display_name: "Hyacinth Macaw",
    audio_message: "Macaws are smart and fabulous.",
    description: "Your striking appearance is the talk of every party. You are always the most colorfully dressed one around. You're also one smart cookie - you were using tools to make your tasks easier before it was cool.",
    img: {
      largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Anodorhynchus_hyacinthinus.1200.jpg"
      //largeImageUrl: imgUrl("result3.jpg"),
    }
  },
  goat: {
    name: "a goat",
    display_name: "Good Old Goat",
    audio_message: "Baaa! You are a goat.",
    description: "Goats are some of the most amazing animals on Earth. Constantly underestimated, they are nearly as impervious to other peoples' opinions as honey badgers. You are quite handy to have around, as you're always happy to take care of leftovers at any party.",
    img: {
      largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Male_goat.1200.jpg"
      //largeImageUrl: imgUrl("result4.jpg"),
    }
  },
  toad: {
    name: "a toad",
    display_name: "Toad",
    audio_message: "You dig relaxing and hanging around in the sunshine.",
    description: "You are athletic and cool, the apple of everyone's eye. You really know how to take it easy and like to spend lots of time basking in the sun and enjoying the great outdoors. When you want to, you can be quite fast and nimble. You're always the first pick for team sports.",
    img: {
      largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Bufo_boreas.1200.jpg"
      //largeImageUrl: imgUrl("result5.jpg"),
    }
  }
};

const questions = [{
    question: "Do you like spending time socializing with others?",
    questionDisplay: "Do you like spending time socializing?",
    background:  "https://voiceprototyping.com/cf/q1.jpg", 
    //background: imgUrl("question1.jpg"),
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
    questionDisplay: "Do you enjoy sunbathing?",
    background: "https://voiceprototyping.com/cf/q2.jpg", 
    //background: imgUrl("question2.jpg"),
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
    questionDisplay: "Do you enjoy a book more than a party?",
    background: "https://voiceprototyping.com/cf/q3.jpg", 
    //background: imgUrl("question3.jpg"),
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
    questionDisplay: "Do you like doing sports?",
    background: "https://voiceprototyping.com/cf/q4.jpg", 
    //background: imgUrl("question4.jpg"),
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
    questionDisplay: "A beach vs a forest. Forest? Yes or no?",
    background: "https://voiceprototyping.com/cf/q5.jpg", 
    //background: imgUrl("question5.jpg"),
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



const newSessionHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var isCurrentlyPlayingOrGettingResult = false;
    if (sessionAttributes.state) {
       isCurrentlyPlayingOrGettingResult = true;
    }


    return handlerInput.requestEnvelope.request.type === `LaunchRequest` || (!isCurrentlyPlayingOrGettingResult && request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.YesIntent' || request.intent.name === 'AMAZON.NoIntent'));
  },
  handle(handlerInput) {

    console.log('--------------------------------------- New session')
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    if (handlerInput.requestEnvelope.request.type === `LaunchRequest`) {
      _initializeApp(sessionAttributes);
      return buildResponse(handlerInput, WELCOME_MESSAGE, WELCOME_MESSAGE, SKILL_NAME);
    }
    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent') {

      sessionAttributes.state = states.QUIZMODE;

      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }
    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent') {
      console.log('--------------------------------------- Exit session')
      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();
      sessionAttributes.state = '';
      return buildResponse(handlerInput, STOP_MESSAGE, '', SKILL_NAME, BACKGROUND_GOODBYE_IMAGE_URL,STOP_MESSAGE);
    }
    if (request.type === 'IntentRequest' && request.intent.name === 'UndecisiveIntent') {
      const outputSpeech = MISUNDERSTOOD_INSTRUCTIONS_ANSWER;
      return buildResponse(handlerInput, outputSpeech, outputSpeech, SKILL_NAME, BACKGROUND_IMAGE_URL,"");
    }
  },
};

const nextQuestionIntent = (handlerInput, prependMessage) => {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  sessionAttributes.questionProgress++;
  var currentQuestion = questions[sessionAttributes.questionProgress].question;
  return {
    prompt: `${prependMessage} ${_randomQuestionIntro(sessionAttributes)} ${currentQuestion}`,
    reprompt: HELP_MESSAGE_AFTER_START,
    displayText: questions[sessionAttributes.questionProgress].questionDisplay,
    background: questions[sessionAttributes.questionProgress].background
  };
}

const resultIntent = (handlerInput, prependMessage) => {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  const animalPoints = sessionAttributes.animalPoints;
  const result = Object.keys(animalPoints).reduce((o, i) => animalPoints[o] > animalPoints[i] ? o : i);
  const resultMessage = `${prependMessage} ${RESULT_MESSAGE} ${animalList[result].name}. ${animalList[result].audio_message}. ${PLAY_AGAIN_REQUEST}`;
  return {
    prompt: resultMessage,
    reprompt: PLAY_AGAIN_REQUEST,
    displayText: `${RESULT_MESSAGE_SHORT} ${animalList[result].name}`,
    background: animalList[result].img.largeImageUrl
  }

  // this.emit(':askWithCard', resultMessage, PLAY_AGAIN_REQUEST, animalList[result].display_name, animalList[result].description, animalList[result].img);
  //                        ^speechOutput  ^repromptSpeech     ^cardTitle                       ^cardContent                    ^imageObj
}


const _randomIndexOfArray = (array) => Math.floor(Math.random() * array.length);
const _randomOfArray = (array) => array[_randomIndexOfArray(array)];
const _adder = (a, b) => a + b;
const _subtracter = (a, b) => a - b;

// Handle user input and intents:

const states = {
  QUIZMODE: "_QUIZMODE",
  RESULTMODE: "_RESULTMODE"
}



const quizModeHandler = {
  canHandle(handlerInput) {

    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var isCurrentlyPlaying = false;
    if (sessionAttributes.state && sessionAttributes.state === states.QUIZMODE) {
      isCurrentlyPlaying = true;
    }

    return isCurrentlyPlaying;
  },
  handle(handlerInput) {
    console.log('---------------------------------------Quiz Mode')
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var prependMessage = '';
    if (request.type === 'IntentRequest' && request.intent.name === 'NextQuestionIntent') {
      const systemSpeak = nextQuestionIntent(handlerInput, prependMessage);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent') {
      _applyAnimalPoints(sessionAttributes, _adder);
      sessionAttributes.state = states.QUIZMODE;
      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent') {
      _applyAnimalPoints(sessionAttributes, _subtracter);
      sessionAttributes.state = states.QUIZMODE;
      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'UndecisiveIntent') {
      Math.round(Math.random()) ? _applyAnimalPoints(sessionAttributes, _adder) : _applyAnimalPoints(sessionAttributes, _subtracter);
      const systemSpeak = _nextQuestionOrResult(handlerInput, _randomOfArray(UNDECISIVE_RESPONSES));
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.RepeatIntent') {
      var currentQuestion = questions[sessionAttributes.questionProgress].question;
      return buildResponse(handlerInput, currentQuestion, HELP_MESSAGE_AFTER_START, SKILL_NAME, BACKGROUND_HELP_IMAGE_URL);
    }
  
  },
};

const resultModeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var isCurrentlyPlaying = false;
    if (sessionAttributes.state &&
      sessionAttributes.state === states.QUIZMODE) {
      isCurrentlyPlaying = true;
    }

    return !isCurrentlyPlaying && request.type === 'IntentRequest' && sessionAttributes.state === states.RESULTMODE;
  },
  handle(handlerInput) {
    console.log('--------------------------------------- Result mode')
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    
    if (request.intent.name === 'AMAZON.YesIntent') {
      _initializeApp(sessionAttributes);
      sessionAttributes.state = states.QUIZMODE;
      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background, systemSpeak.displayText);
    }
    if (request.intent.name === 'AMAZON.NoIntent') {
      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();
      sessionAttributes.state = '';
      return buildResponse(handlerInput, STOP_MESSAGE, '', SKILL_NAME, BACKGROUND_GOODBYE_IMAGE_URL,STOP_MESSAGE);
    
    }
    


  },
};


const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.CancelIntent' ||
        request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    console.log('--------------------------------------- Exit session')
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    sessionAttributes.state = '';
    return buildResponse(handlerInput, STOP_MESSAGE, '', SKILL_NAME, BACKGROUND_GOODBYE_IMAGE_URL,STOP_MESSAGE);
    //------------------------------------------------
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    console.log('--------------------------------------- Help')
    const attributesManager = handlerInput.attributesManager;
    var speechOutput = '';
    const sessionAttributes = attributesManager.getSessionAttributes();
    if (sessionAttributes.state === states.QUIZMODE) {
       speechOutput = HELP_MESSAGE_AFTER_START;
    } else {
       speechOutput = HELP_MESSAGE_BEFORE_START;
    }
    const reprompt = HELP_REPROMPT;
    return buildResponse(handlerInput, speechOutput, reprompt, SKILL_NAME, BACKGROUND_HELP_IMAGE_URL);
  },
};
const UnhandledHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    console.log('---------------------------------------Unhandled')
    const outputSpeech = MISUNDERSTOOD_INSTRUCTIONS_ANSWER;
    return buildResponse(handlerInput, outputSpeech, outputSpeech, SKILL_NAME);
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

// Skill brain

const _initializeApp = handler => {
  // Set the progress to -1 one in the beginning
  handler.questionProgress = -1;
  // Assign 0 points to each animal
  var initialPoints = {};
  Object.keys(animalList).forEach(animal => initialPoints[animal] = 0);
  handler.animalPoints = initialPoints;
};

const _nextQuestionOrResult = (handlerInput, prependMessage = '') => {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  if (sessionAttributes.questionProgress >= (questions.length - 1)) {

    sessionAttributes.state = states.RESULTMODE;
    return resultIntent(handlerInput, prependMessage)


  } else {
    return nextQuestionIntent(handlerInput, prependMessage);
  }
};

const _applyAnimalPoints = (handler, calculate) => {
  const currentPoints = handler.animalPoints;
  const pointsToAdd = questions[handler.questionProgress].points;

  handler.animalPoints = Object.keys(currentPoints).reduce((newPoints, animal) => {
    newPoints[animal] = calculate(currentPoints[animal], pointsToAdd[animal]);
    return newPoints;
  }, currentPoints);
};

const _randomQuestionIntro = handler => {
  if (handler.questionProgress === 0) {
    // return random initial question intro if it's the first question:
    return _randomOfArray(INITIAL_QUESTION_INTROS);
  } else {
    // Assign all question intros to remainingQuestionIntros on the first execution:
    var remainingQuestionIntros = remainingQuestionIntros || QUESTION_INTROS;
    // randomQuestion will return 0 if the remainingQuestionIntros are empty:
    let randomQuestion = remainingQuestionIntros.splice(_randomIndexOfArray(remainingQuestionIntros), 1);
    // Remove random Question from rameining question intros and return the removed question. If the remainingQuestions are empty return the first question:
    return randomQuestion ? randomQuestion : QUESTION_INTROS[0];
  }
};

// Utilities


let buildResponse = (handlerInput, prompt, reprompt, title = SKILL_NAME, image_url = BACKGROUND_IMAGE_URL,  displayText = SKILL_NAME, display_type = "BodyTemplate7" ) => {
  console.log(title);
  if (reprompt) {
    handlerInput.responseBuilder.reprompt(reprompt);
  } else {
    handlerInput.responseBuilder.withShouldEndSession(true);
  }
  var response;
  if (supportsDisplay(handlerInput)) {
    response = getDisplay(handlerInput.responseBuilder, title,  displayText, image_url, display_type)	
  }
  else{
    response = handlerInput.responseBuilder
  }
  return response
  .speak(prompt)
  .getResponse();
}
function supportsDisplay(handlerInput) {
  var hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display
  return hasDisplay;
}


function getDisplay(response, title, displayText, image_url, display_type){
	const image = new Alexa.ImageHelper().addImageInstance(image_url).getImage();

	console.log("the display type is => " + display_type);
    console.log(image_url);

	const myTextContent = new Alexa.RichTextContentHelper()
	.withPrimaryText(title+"<br/>")
	.withSecondaryText(displayText)
	.withTertiaryText("<br/> ")
	.getTextContent();
	
	if (display_type === "BodyTemplate7"){
		//use background image
		response.addRenderTemplateDirective({
			type: display_type,
			backButton: 'visible',
			backgroundImage: image,
			title:displayText,
			textContent: myTextContent,
			});	
	}
	else{
		response.addRenderTemplateDirective({
			//use 340x340 image on the right with text on the left.
			type: display_type,
			backButton: 'visible',
			image: image,
			title:displayText,
			textContent: myTextContent,
			});	
	}
	
	return response
}

// Init

  const skillBuilder = Alexa.SkillBuilders.custom();
  exports.handler = skillBuilder
    .addRequestHandlers(
      SessionEndedRequestHandler, HelpIntentHandler, ExitHandler, newSessionHandler, quizModeHandler, resultModeHandler, UnhandledHandler
    )
    //.addErrorHandlers(ErrorHandler)
    .lambda();
