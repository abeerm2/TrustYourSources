const express = require("express");
const cors = require("cors");
const https = require('https');
const classifyNewsArticles = require('./news_model');
const classifySocialMedia = require('./twitter_model');
const dotenv = require("dotenv");
const needle = require("needle");
const app = express();
dotenv.config();
const BearerToken = 'AAAAAAAAAAAAAAAAAAAAABnelAEAAAAAnDzKf%2BCb0rxd6sqnXbHC7Ejj%2FQU%3D7ZvQWXbXTCAYhR4IrlXBhGMlILzBlCnIkdIqF1MRso32Kx4RmB';
const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

//Get Tweets from Twitter API
const getTweets = async(id) => {

    const params = {
        'query': `${id} lang:en`,
        'tweet.fields': 'created_at',
        'expansions': 'author_id'
    }
    const response = await needle ('get', endpointUrl, params,{
        headers: {
            "User-Agent": "v2RecentSearchJS",
            "authorization": `Bearer ${BearerToken}`
        }
    })

    if (response.statusCode !== 200) {
        if (response.statusCode === 403) {
            res.status(403).send(response.body);
        } 
        else {
            throw new Error(response.body.error.message);
        }
    }
    if (response.body)
        return response.body;
    else
        throw new Error("Unsuccessful Request");   
}
//This returns the object to client
const getTweetAnalysis = async(req, res) => {
    try {
        let twitterData =await getTweets(req.params.id);
        //res.send(twitterData);
        res.send(await analyze(twitterData));
    } catch (error) {
        res.send(error);
    }

}

//Simple Analysis
const twitterObject = {}
const analyze = async(twitterData) =>
{
    twitterObject["username"] = twitterData.includes.users[0].username;
    twitterObject["name"] = twitterData.includes.users[0].name;
    return twitterData.data
}

//API route 
app.get('/api/tweet/:id', getTweetAnalysis)
app.get('/api/cohere/:text', (req, res)=>{
    const text = req.params.text;
    const val = coherefn(text)
    res.send(val)
})
app.use(cors());
app.use(express.json());

app.get('/api/:keyword', async(req,res) => {
    let userAgent = req.get('user-agent');
    let data = await NewsAPICall(req.params.keyword,userAgent,res);
});

async function NewsAPICall(keyword, userAgent,res) {
    //const userAgent = req.get('user-agent');
    const options = {
        host: 'newsapi.org',
        path: `/v2/everything?q=${keyword}&pageSize=96&apiKey=fb4ca3c8afb547a0a3b2b74918d9ae82`,
        headers: {
          'User-Agent': userAgent
        }
    }
    https.get(options, function (response) {
        let data;
        response.on('data', function (chunk) {
            if (!data) {
                data = chunk;
            }
            else {
                data += chunk;
            }
        });
        response.on('end', async function () {
            const newsData = JSON.parse(data);
            let arrayOfHeadlines = [];
            for(let item of newsData.articles){
                arrayOfHeadlines.push(item.title);
            }
    
            res.send({data: await cohereNewsArticles(arrayOfHeadlines)});
        });
    });
}

//Start your server on a specified port
app.listen(3100, ()=>{
    console.log(`Server is runing on port ${3100}`)
});

const cohere = require('cohere-ai');
cohere.init('CkDyobTPuxXHETB5lRaIjEQgUntgXTivHbsGQi51');

function coherefn(input){
    (async () => {
    const response = await cohere.classify({
        model: 'small',
        inputs: [input],
        examples: [{"text": "Idaho Murders Suspect Felt No Emotion and Little Remorse as a Teen", "label": "negative"}, {"text": "Idaho murders  latest news: Bryan Kohbergers chilling past comments come to light", "label": "negative"}, {"text": "Idaho murders timeline: What we know about the slayings of four students", "label": "neutral"}, {"text": "What we know so far about the investigation into the Idaho college student murders", "label": "neutral"}, {"text": "Hope Within the Heartbreak: Finding Good News in Ukraine", "label": "positive"}, {"text": "Sunak confirms UK will send tanks to Ukraine ‘to push Russian troops back’", "label": "positive"}, {"text": "Germany opens its 2nd liquefied natural gas terminal", "label": "positive"}, {"text": "BBC PROMS 2022: UKRAINIAN REFUGEE ORCHESTRA AMONG THE LINE-UP", "label": "positive"}, {"text": "It’s time for the international community to address this crisis with greater honesty about the key players and solutions", "label": "positive"}, {"text": "Ask the AI program a question, as millions have in recent weeks, and it will do its best to respond", "label": "positive"}, {"text": "Why tech insiders are so excited about ChatGPT, a chatbot that answers questions and writes essays", "label": "positive"}, {"text": "What’s the point of personal statements when ChatGPT can say it so much better?", "label": "positive"}, {"text": "ChatGPT Has Investors Drooling—but Can It Bring Home the Bacon?", "label": "positive"}, {"text": "From changing your diet to offering refugees a room, here are five things you can do to help the Ukrainian people", "label": "positive"}, {"text": "First commercial drone home delivery service in U.S. takes flight", "label": "positive"}, {"text": "10 INNOVATIVE TECHNOLOGIES WITH POTENTIAL IMPACT FOR BUSINESS", "label": "positive"}, {"text": "From advancements in artificial intelligence technologies to 3D printing, 2018 has been a major year in tech. As cutting-edge technologies reach the market and are integrated, business strategies may evolve as well.", "label": "positive"}, {"text": "We live in an era called the information age. New technology is emerging every day to make life simpler, more advanced and better for everyone. The rate at which technology is evolving is almost exponential today. For business organisations, new technology helps to reduce costs, enhance customer experiences and increase profits.", "label": "positive"}]
    });
    for(id in response.body.classifications){
        console.log(response.body.classifications[id].prediction)
        return (response.body.classifications[id].prediction)
    }
    })();
}

async function cohereNewsArticles(input){
    const response = await cohere.classify({
        model: 'small',
        inputs: input,
        examples: [{"text": "Idaho Murders Suspect Felt No Emotion and Little Remorse as a Teen", "label": "negative"}, {"text": "Idaho murders  latest news: Bryan Kohbergers chilling past comments come to light", "label": "negative"}, {"text": "Idaho murders timeline: What we know about the slayings of four students", "label": "neutral"}, {"text": "What we know so far about the investigation into the Idaho college student murders", "label": "neutral"}, {"text": "Hope Within the Heartbreak: Finding Good News in Ukraine", "label": "positive"}, {"text": "Sunak confirms UK will send tanks to Ukraine ‘to push Russian troops back’", "label": "positive"}, {"text": "Germany opens its 2nd liquefied natural gas terminal", "label": "positive"}, {"text": "BBC PROMS 2022: UKRAINIAN REFUGEE ORCHESTRA AMONG THE LINE-UP", "label": "positive"}, {"text": "It’s time for the international community to address this crisis with greater honesty about the key players and solutions", "label": "positive"}, {"text": "Ask the AI program a question, as millions have in recent weeks, and it will do its best to respond", "label": "positive"}, {"text": "Why tech insiders are so excited about ChatGPT, a chatbot that answers questions and writes essays", "label": "positive"}, {"text": "What’s the point of personal statements when ChatGPT can say it so much better?", "label": "positive"}, {"text": "ChatGPT Has Investors Drooling—but Can It Bring Home the Bacon?", "label": "positive"}, {"text": "From changing your diet to offering refugees a room, here are five things you can do to help the Ukrainian people", "label": "positive"}, {"text": "First commercial drone home delivery service in U.S. takes flight", "label": "positive"}, {"text": "10 INNOVATIVE TECHNOLOGIES WITH POTENTIAL IMPACT FOR BUSINESS", "label": "positive"}, {"text": "From advancements in artificial intelligence technologies to 3D printing, 2018 has been a major year in tech. As cutting-edge technologies reach the market and are integrated, business strategies may evolve as well.", "label": "positive"}, {"text": "We live in an era called the information age. New technology is emerging every day to make life simpler, more advanced and better for everyone. The rate at which technology is evolving is almost exponential today. For business organisations, new technology helps to reduce costs, enhance customer experiences and increase profits.", "label": "positive"}]
    });
    //console.log(response.body.classifications);
    let total = 0;
    let positive = 0;
    let confidence = 0.00;
    for(let result of response.body.classifications){
        total += 1;
        if(result.prediction == "positive"){
            positive += 1;
            confidence += result.confidence;
        }
    }
    let returnObj = {
        positiveRatio: (positive/total)*100,
        confidence: confidence/total
    }
    return returnObj;
}