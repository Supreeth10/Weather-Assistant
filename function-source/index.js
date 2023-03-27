// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';


const axios = require('axios');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
   
  }

 
  
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  function FindJacket(feelsLike, rain, wind) {
  let res;
  let jacketType1;
  if (rain > 75) {
    res = `there is a ${rain}% chance of rain, you should wear a rain jacket`;
    jacketType1 = "raincoat";
  } else if (wind > 25) {
    res = `there is a ${wind}mph wind, you should wear a windbreaker`;
    jacketType1 = "windbreaker";
  } else if (feelsLike < 5) {
    res = `it feels like ${feelsLike} degrees celsius, you should wear a heavy coat`;
    jacketType1 = "heavycoat";
  } else if (feelsLike < 10) {
    res = `it feels like ${feelsLike} degrees celsius, you should wear a warm coat`;
    jacketType1 = "warmcoat";
  } else if (feelsLike < 15) {
    res = `it feels like ${feelsLike} degrees celsius, you should wear a light coat`;
    jacketType1 = "lightcoat";
  } else if (feelsLike < 20) {
    res = `it feels like ${feelsLike} degrees celsius, you should wear a sweater or hoodie`;
    jacketType1 = "sweater";
  } else if (feelsLike < 25) {
    res = `it feels like ${feelsLike} degrees celsius, you might not need to wear a jacket`;
    jacketType1 = "none";
  }
  return { res, jacketType1 };
}
  function JacketIntentHandler(agent) {
   const jacket =agent.parameters.jacket;
   const jacketType =agent.parameters.jacketType;
   const date = agent.parameters.datetime;
   const city = agent.parameters.geocity;
    
    const options = {
    method: "GET",
    url: "https://weatherapi-com.p.rapidapi.com/forecast.json",
    params: { q: city, dt: date },
    headers: {
      "X-RapidAPI-Key": "f428aa25e2msh24d6d1c5f363ec3p123172jsn065402d94e92",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };
    
    let res;
    return axios
    .request(options)
    .then(function (response) {
      let feelsLike = response.data.forecast.forecastday[0].day.avgtemp_c;
      let rain = response.data.forecast.forecastday[0].day.daily_chance_of_rain;
      let wind = response.data.forecast.forecastday[0].day.maxwind_mph;
      if (jacket.length !== 0) {
        let { res, jacketType1 } = FindJacket(feelsLike, rain, wind);
        console.log(res);
        agent.add(res);
      } else if (jacketType.length !== 0) {
        let { res, jacketType1 } = FindJacket(feelsLike, rain, wind);
        if (jacketType1 === jacketType) {
          res = `yep, a ${jacketType} is suitable for the forcasted weather`;
          agent.add(res);
        } else {
          res = `no, a ${jacketType} is not suitable for the forcasted weather. ${res}`;
          agent.add(res);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
      agent.add("im sorry, something went wrong. Please try again");
      console.log("im sorry, something went wrong. please try again");
    });
    
  }
  
  function AstronomyIntentHandler(agent) {
   const ast =agent.parameters.astronomy;
   const date = agent.parameters.datetime;
   const city = agent.parameters.geocity;
   const options = {
    method: "GET",
    url: "https://weatherapi-com.p.rapidapi.com/astronomy.json",
    params: { q: city, dt: date },
    headers: {
      "X-RapidAPI-Key": "f428aa25e2msh24d6d1c5f363ec3p123172jsn065402d94e92",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };
    
    return axios
    .request(options)
    .then(function (response) {
      if (ast === "sunrise") {
        let time = response.data.astronomy.astro.sunrise;
        let res = `The sun will rise at ${time} in ${city}.`;
        agent.add(res);
        console.log(res);
      } else if (ast === "sunset") {
        let time = response.data.astronomy.astro.sunset;
        let res = `The sun will set at ${time} in ${city}.`;
         agent.add(res);
        console.log(res);
      } else if (ast === "moonrise") {
        let time = response.data.astronomy.astro.moonrise;
        let res = `The moon will rise at ${time} in ${city}.`;
         agent.add(res);
        console.log(res);
      } else if (ast === "moonset") {
        let time = response.data.astronomy.astro.moonset;
        let res = `The moon will set at ${time} in ${city}.`;
         agent.add(res);
        console.log(res);
      } else if (ast === "moonphase") {
        let time = response.data.astronomy.astro.moon_phase;
        let res = `The moon phase is ${time} in ${city}.`;
         agent.add(res);
        console.log(res);
      } else {
        let res = `I am sorry, I do not know that. Please try asking again.`;
         agent.add(res);
      }
    })
    .catch(function (error) {
      let res = `I am sorry, I do not know that. Please try asking again.`;
       agent.add(res);
      console.error(error);
    });
    
  }
 function GetWeather(agent) {
  let url = "";
  let param = {};
  const city = agent.parameters.geocity;
  const date = agent.parameters.datetime;
  let flag;
  if (date === "" || date === null || date === undefined) {
    url = "https://weatherapi-com.p.rapidapi.com/current.json";
    param = { q: city };
    flag = 1;
    console.log("date is null");
  } else {
    url = "https://weatherapi-com.p.rapidapi.com/forecast.json";
    param = { q: city, dt: date };
    flag = 0;
    console.log("date is not null");
  }
  //url = "https://weatherapi-com.p.rapidapi.com/forecast.json";
  //param = { q: city, dt: date };

  const options = {
    method: "GET",
    url: url,
    params: param,
    headers: {
      "X-RapidAPI-Key": "f428aa25e2msh24d6d1c5f363ec3p123172jsn065402d94e92",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };
   let res;

 return axios
    .request(options)
    .then(function (response) {
      if (flag === 1) {
        let text = response.data.current.condition.text;
        let temp = response.data.current.temp_c;
        let feelsLike = response.data.current.feelslike_c;
        let res = `The weather in ${city} is ${text} and the temperature is ${temp} degrees celsius. It feels like ${feelsLike} degrees celsius.`;
       
        agent.add(res);
      } else {
        let text = response.data.forecast.forecastday[0].day.condition.text;
        let temp = response.data.forecast.forecastday[0].day.avgtemp_c;
        let res = `The weather in ${city} is ${text} and the temperature is ${temp} degrees celsius.`;
         
        agent.add(res);
      }
    })
    .catch(function (error) {
      agent.add(res);
    });
  
}

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('GetWeather', GetWeather);
  intentMap.set('AstronomyIntent', AstronomyIntentHandler);
  intentMap.set('JacketIntent', JacketIntentHandler);
  agent.handleRequest(intentMap);
});
