const express = require("express");
const cors = require("cors");
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

app.get('/test', (req,res) => {
    res.send({message: "hi"});
});

//Start your server on a specified port
app.listen(3100, ()=>{
    console.log(`Server is runing on port ${3100}`)
});