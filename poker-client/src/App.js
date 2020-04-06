import React from 'react';
import Hand from './components/Hand';
// eslint-disable-next-line
import { CLUBS, DIAMONDS, HEARTS, SPADES } from './components/Card/constants';

function App() {
  return (
    <div className="App">
      <Hand cards={[
        {
          rank: "A",
          suit: CLUBS
        },
        {
          rank: "A",
          suit: HEARTS
        }
      ]} />
    </div>
  );
}

export default App;
