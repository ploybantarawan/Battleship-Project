import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import Sound from 'react-sound';
import useSound from 'use-sound';
import ClickSound from '../../assets/sound/click.mp3';
import BackGroundMusic from '../../assets/sound/game sound.mp3';
import { SECS_PER_ROUND } from '../../constants';
import { getRandomUnshotCoordinate } from '../../helpers';
import PlayerStatus from '../PlayerStatus';
import StatusBoard from '../Status';
import Board from './Board/';
import './Display.css';
import GameOverOverlay from './GameOverOverlay';
import OpponentDisconnectOverlay from './OpponentDisconnectOverlay';

const Display = ({
  myState,
  opponentState,
  newGame,
  continueGame,
  gameState,
}) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [playClickSound] = useSound(ClickSound);

  const countDownRenderer = ({ seconds }) => {
    return (
      <p
        style={{
          color: 'white',
        }}
      >
        Time Remaining:
        <span
          style={{
            margin: '0px 20px',
            fontSize: 48,
          }}
        >
          {seconds}
        </span>
        Seconds
      </p>
    );
  };

  const playSound = () => {
    if (!isPlayingSound) {
      setIsPlayingSound(true);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', playSound);

    return () => {
      window.removeEventListener('mousemove', playSound);
    };
  }, []);

  const onTimeOut = () => {
    if (gameState == 3) {
      const { shot, clickTile } = opponentState;
      const coordinate = getRandomUnshotCoordinate(shot);
      clickTile(coordinate);
      playClickSound();
      // myState.timeOut()
    }
  };

  const handleContinue = () => {
    continueGame();
  };

  const handleNewGame = () => {
    newGame();
  };

  return (
    <>
      <PlayerStatus
        isPlayerOneOnline={true}
        isPlayerTwoOnline={gameState >= 1}
      />
      {gameState == -1 && (
        <OpponentDisconnectOverlay
          name={opponentState.playerName}
          newGame={newGame}
        />
      )}
      {gameState >= 5 && (
        <GameOverOverlay
          playerName={myState.playerName}
          score={myState.myOverallScore}
          opponentScore={myState.opponentOverallScore}
          onContitnue={handleContinue}
          newGame={handleNewGame}
        />
      )}
      {gameState == 3 && (
        <Countdown
          date={Date.now() + SECS_PER_ROUND * 1000}
          renderer={countDownRenderer}
          onComplete={onTimeOut}
        />
      )}
      {gameState == 4 && (
        <Countdown
          date={Date.now() + SECS_PER_ROUND * 1000}
          renderer={countDownRenderer}
        />
      )}
      <div className="display">
        <Board playClickSound={playClickSound} state={myState} />
        <Board playClickSound={playClickSound} state={opponentState} />
        <StatusBoard score={myState.score} {...{ newGame }} />
      </div>
      <Sound
        autoLoad
        loop
        volume={50}
        url={BackGroundMusic}
        playStatus={
          isPlayingSound ? Sound.status.PLAYING : Sound.status.STOPPED
        }
      />
    </>
  );
};

export default Display;
