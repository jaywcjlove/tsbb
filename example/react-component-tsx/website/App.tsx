import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '../';

const App: React.FC = () => {
  // console.log('Button:', Button);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>
          <Button type="primary">Primary</Button>
          <Button type="success">Success</Button>
          <Button type="warning">Warning</Button>
          <Button type="danger">Danger</Button>
          <Button type="light">Light</Button>
          <Button type="dark">Dark</Button>
        </div>
      </header>
    </div>
  );
}

export default App;
