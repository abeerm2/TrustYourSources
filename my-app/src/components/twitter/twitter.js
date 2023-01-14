import {React, useEffect, useState} from 'react'
import './twitter.css'
function Twitter() {
    const [item, setItem]=useState([]);

    function getTweets(){
        fetch('/api/tweet/ukraine')
        .then((res) => res.json())
        .then(item=>setItem(item))
        console.log(item)
        return item
    }
    useEffect(()=>{
        getTweets()
    },[]);
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
              {item.map((item)=>(
                <div key = {item.id} className='tweet-container'>
                    <p>{item.text}</p>
                    <p>Positive</p>
                 </div>
              ))}
          </div>

        </div>
      );
}

export default Twitter
