import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/home/home';
import News from './components/news/news';
import Twitter from './components/twitter/twitter';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/news' element={<News></News>}></Route>
        <Route path='/twitter' element={<Twitter></Twitter>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
