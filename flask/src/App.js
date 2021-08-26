import logo from './logo.svg';
import './App.css';

import {useState, useEffect} from 'react';

function App() {
  const [mess, setMess] = useState([])

  useEffect(() => {
    fetch('/api').then(res => {
      if (res.ok) {
        return res.json();
      }
    }).then(data => setMess(data))
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. 
        </p>
        <>
        {
          mess.map((el)=> <ul><li>{el.content}</li></ul>) 
        }
        </>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
