const express = require("express");
const cors = require("cors");
const https = require('https');
const classifyNewsArticles = require('./news_model');
const classifySocialMedia = require('./twitter_model');

const app = express();
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