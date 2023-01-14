import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/home/home';
import News from './components/news/news';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/news' element={<News></News>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
