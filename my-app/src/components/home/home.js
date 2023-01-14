import {React} from 'react'
import './home.css'
import { useNavigate } from 'react-router-dom';
function Home() {
    const nav = useNavigate();
    
    function openT(){
      nav('/twitter')
    }
    return (
        <div className="App">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
          <h1 className="App-header">
            Trust Your Sources
          </h1>
          <p className="ourName">By Hack(her)z</p>
          <div className="bar">
            <button className='btn' onClick={openT}>Trending on Social Media</button>
            <button className='btn'>Trending on News Outlets</button>
          </div>
          <div className='body'>
              <input className='search' placeholder='Search Value'></input>
              <button className='searchBtn'><span class="material-symbols-outlined">search</span></button>
          </div>
        </div>
      );
}

export default Home
