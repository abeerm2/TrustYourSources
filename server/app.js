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
app.use(cors());
app.use(express.json());

app.get('/api/:keyword', (req,res) => {
    console.log(req.get('user-agent'));
    let data = NewsAPICall(req.params.keyword,req);
    res.send(data);
});

function NewsAPICall(keyword, req) {
    const userAgent = req.get('user-agent');
    const options = {
        host: 'newsapi.org',
        path: `/v2/everything?q=${keyword}&apiKey=fb4ca3c8afb547a0a3b2b74918d9ae82`,
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
        response.on('end', function () {
            const newsData = JSON.parse(data);
            let arrayOfHeadlines = [];
            for(let item of newsData.articles){
                arrayOfHeadlines.push(item.title);
            }
            console.log(arrayOfHeadlines);
            let classification = classifyNewsArticles(arrayOfHeadlines);
            console.log(classification);
        });
    });
}

//Start your server on a specified port
app.listen(3100, ()=>{
    console.log(`Server is runing on port ${3100}`)
});