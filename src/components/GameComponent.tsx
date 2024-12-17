import { Devvit, useState } from "@devvit/public-api";
import * as React from 'react'

const styles = {
  gameContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center'
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  board: {
    width: '100%',
    maxWidth: '400px',
    aspectRatio: '1',
    margin: '0 auto',
    position: 'relative',
    backgroundColor: '#f0f0f0',
    border: '2px solid #333'
  }
};

export const GameComponent = () => {
  const [moveCount, setMoveCount] = useState(0);
  const [bestScore, setBestScore] = useState('-');

  return (
    <zstack height="100%" width="100%">
      <text size="xlarge" weight="bold">华容道 Huarong Dao</text>
      
      <zstack  gap="medium">
        <select id="levelSelector">
          <option value="0">Level 1</option>
          <option value="1">Level 2</option>
          <option value="2">Level 3</option>
          <option value="3">Level 4</option>
          <option value="4">Level 5</option>
        </select>
        
        <select id="languageSelector">
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </zstack>
      
      <div style={styles.board} id="board" />
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => {}}>Reset Game</button>
        <button onClick={() => {}}>Undo Move</button>
      </div>
      
      <p>Moves: {moveCount} | Best: {bestScore}</p>
    </zstack>
  );
};
