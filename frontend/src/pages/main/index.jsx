import React from 'react';
import './style.css';
import Display from '../../components/Display';
import LogList from '../../components/Log';
import Heading from '../../components';
import useGame from '../../hooks/useGame';
import { useState } from 'react';

const MainPage = ({ socket }) => {
  const { myState, opponentState, logState, gameState } = useGame(socket);

  const { messages, newGame, continueGame } = logState;

  return (
    <>
      <Heading />
      <Display
        {...{ myState, opponentState, newGame, gameState, continueGame }}
      />
      <LogList {...{ messages }} />
    </>
  );
};

export default MainPage;
