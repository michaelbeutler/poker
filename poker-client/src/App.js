import React from 'react';
import Card from './components/Card';
import { CLUBS, DIAMONDS, HEARTS, SPADES } from './components/Card/constants';

function App() {
  return (
    <div className="App">
      <Card rank={"A"} suit={CLUBS} />
      <Card rank={"A"} suit={DIAMONDS} />
      <Card rank={"A"} suit={HEARTS} />
      <Card rank={"A"} suit={SPADES} />
    </div>
  );
}

export default App;
