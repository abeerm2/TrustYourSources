import {ReactComponentElement, useEffect, useState} from 'react'
import './news.css'
function News() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
      fetch('/api/topArticlesToday/results')
        .then((res) => res.json())
        .then(article => {
          setArticles(article);
          console.log(article);
        })
    }, []);

    return (
        <div className="App">
          <h1 className="App-header">
            Trust Your Sources
          </h1>
          <p className="ourName">By Hack(her)z</p>
          <div className="bar">
            <button className='btn'>Trending on Social Media</button>
            <button className='btn'>Trending on News Outlets</button>
          </div>
          <div className='body'>
              <input className='search' placeholder='Search Value'></input>
              {articles.results.map((item)=>(
                <div key = {item.author} className='tweet-container'>
                    <p>{item.title}</p>
                    <p>Positive</p>
                 </div>
              ))}
          </div>
        </div>
      );
}

export default News
