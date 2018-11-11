/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'amzn1.ask.skill.55412393-9998-49de-8121-edc838327d48';

// Messages

// Name of the skill
const SKILL_NAME = 'Homework Hack';

// Yes No Prompts
var ynPrompt = 0;

// Array Iterator
var arrIter = 0;

// Homework Array
var homework = [];

// Homework Time
var homeworkTime = 0;

// Break Time
var breakTime = 0;

// Prompts
const NAME_PROMPT = "What's your name?";
const CLASS_PROMPT = "What classes do you have?";
const EXTRAC_PROMPT = "What extracurriculars do you have?";
 

// Messages
const WELCOME_MESSAGE = "What homework do you have";
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'What can I help you with? I can take in homework assignments, tell you due dates, and more.';
const STOP_MESSAGE = 'Goodbye! Thanks for coming to sunhacks.';
const FALLBACK_MESSAGE = "My sunhacks development team hasn't written code for this.";
const CHECK_MESSAGE = "I'm checking for your homework";

// Reprompts
// %s is a string placer - it allows a string to be inserted in the constant.
const HELP_REPROMPT = 'What can I help you with?';
const CLASS_START_TIME = "When does %s start?";
const CLASS_END_TIME = "When does %s end?";
const HWK_DUE_DATE = "What is the due date for %s?";
const HWK_DUE_TIME = "What time is the %s due?";
const HWK_DUE_LENGTH = "How long will it take you to complete this %s";
const EXTRAC_START_TIME = "When does %s start?";
const EXTRAC_END_TIME = "When does % end?";
const HWK_DUE_AMOUNT = "How many homework(s) is left?";
const HWK_DUE_TODAY = "How many homework(s) is due today?";

//

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
  'LaunchRequest': function() {
    this.emit('welcomeIntent');
  },
  'welcomeIntent': function() {
    // Q : "what homework do you have?"
    const speechOutput = WELCOME_MESSAGE;

    this.response.speak(speechOutput).listen();
    this.emit(':responseReady');
  },
  'initHomeworkIntent': function() {
    // A : "I have a reading on Monday at 2"
    const HomeworkType = this.event.request.intent.slots.HomeworkType.value;
    const dueDate = this.event.request.intent.slots.DueDate.value;
    const dueTime = this.event.request.intent.slots.DueTime.value;
    
    // Place the assignment in the homework
    var assignment = [HomeworkType, dueDate, dueTime];
    homework.push(assignment);
    
    // Tells the Yes No function where the response came from
    ynPrompt = 1;
    this.response.speak("You have added a " + HomeworkType + " on " + dueDate + " at " + dueTime + ". Do you want to add another?").listen();
    this.emit(':responseReady');
  },
  
  'wantWork': function() {
    this.response.speak("Do you want to work on your homework now?").listen();
    ynPrompt = 2;
    this.emit(':responseReady');
  },
  'AMAZON.YesIntent': function() {
    if(ynPrompt == 1){
      this.response.speak("What homework do you want to add?").listen();
      this.emit(':responseReady');
    }
    else if (ynPrompt == 2){
      this.emit('checkHomeworkIntent');
    }
    else if (ynPrompt == 3){
      this.emit('promptForLater');
    }
  },
  'AMAZON.NoIntent': function(){
    if(ynPrompt == 1){
      this.emit('wantWork');
    }
    else if (ynPrompt == 2){
      this.emit('AMAZON.StopIntent');
    }
    else if (ynPrompt == 3){
        if((arrIter + 1) < homework.length){
            arrIter += 1;
        }
        else{
            arrIter = 0;
        }
        this.emit('checkHomeworkIntent');
    }
  },
  'checkHomeworkIntent': function() {
    try{
    const assignment = homework[arrIter];
    ynPrompt = 3;
    const speechOutput = "Do you want to work on your " + assignment[0] + " that's due on " + assignment[1] + "? To stop, say stop.";
    this.response.speak(speechOutput).listen();
    this.emit(':responseReady');
    }
    catch(NullPointerException) {
        this.emit('AMAZON.StopIntent');
    }
  },
  'promptForLater': function() {
      this.response.speak("When you're done, say: Alexa, tell homework hack I'm done. If you want to work on something else, say Alexa, tell homework hack I want to work on something else.");
      this.emit(":responseReady");
  },
  'finishedHomework': function() {
      homework.splice(arrIter, 1);
      arrIter = 0;
      this.emit("wantWork");
  },
  'somethingElse': function() {
    if((arrIter + 1) < homework.length){
            arrIter += 1;
        }
        else{
            arrIter = 0;
        }
    this.emit("wantWork");
  },
  'AMAZON.FallbackIntent': function() {
    this.response.speak(FALLBACK_MESSAGE);
    this.emit(':responseReady');
  },
  
  'AMAZON.HelpIntent': function() {
    const speechOutput = HELP_MESSAGE;
    const reprompt = HELP_REPROMPT;

    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function() {
    this.response.speak(STOP_MESSAGE);
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function() {
    this.response.speak(STOP_MESSAGE);
    this.emit(':responseReady');
  },
  
};

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
