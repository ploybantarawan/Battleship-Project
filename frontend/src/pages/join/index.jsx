import React, { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import Heading from '../../components';
import { MSG_WAITING_FOR_PLAYER } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import useGame from '../../hooks/useGame';
import './style.css';

const JoinPageForms = ({ socket }) => {
  const [waitingFlag, setWaitingFlag] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const { logState } = useGame(socket);
  const { messages, newGame } = logState;

  const [numOnlineClients, setNumOnlineClients] = useState(0);

  useEffect(() => {
    socket.on('numOnlineClients', function (numOnlineClients) {
      setNumOnlineClients(numOnlineClients);
    });
    socket.emit('numOnlineClients');

    let interval = setInterval(() => {
      socket.emit('numOnlineClients');
    }, 1000);

    return () => {
      clearInterval(interval);
      socket.off('numOnlineClients');
    };
  }, []);

  useEffect(() => {
    if (
      messages[messages.length - 1].message ===
        'Select 5 tiles for your carrier.' &&
      waitingFlag
    ) {
      navigate('/main');
    }
  }, [messages, waitingFlag, navigate]);
  const handleWaitingFlag = () => {
    if (playerName !== '') {
      handleProcessing();
    } else {
      addToast('Enter your name!', { appearance: 'error' });
    }
  };
  const handleWaitingFlagByKey = (event) => {
    if (event.key === 'Enter') {
      if (playerName !== '') {
        handleProcessing();
      } else {
        addToast('Enter your name!', { appearance: 'error' });
      }
    }
  };
  const handlePlayerName = (event) => {
    setPlayerName(event.target.value);
  };
  const handleProcessing = () => {
    setWaitingFlag(!waitingFlag);
    newGame(playerName);
  };
  return (
    <div className="join-page-container">
      <Heading />
      {!waitingFlag ? (
        <div className="page-content-tab-wrapper">
          <p className="player-status-label">
            Overall Online Player: {numOnlineClients}
          </p>
          <p className="label-content">Enter Your Name:</p>
          <input
            type="text"
            placeholder="Enter your name..."
            className="player-name-input"
            onKeyDown={(e) => {
              handleWaitingFlagByKey(e);
            }}
            onChange={(e) => handlePlayerName(e)}
            value={playerName}
          />
          <button className="main-button" onClick={() => handleWaitingFlag()}>
            New Game
          </button>
        </div>
      ) : (
        <div className="page-content-tab-wrapper">
          <p className="player-status-label">Welcome, {playerName}</p>
          <p className="label-content">{MSG_WAITING_FOR_PLAYER}</p>
          <ClipLoader color="white" />
          <button className="main-button" onClick={() => handleWaitingFlag()}>
            Back
          </button>
        </div>
      )}
    </div>
  );
};

const JoinPage = ({ socket }) => (
  <ToastProvider autoDismiss={true} autoDismissTimeout="2000">
    <JoinPageForms socket={socket} />
  </ToastProvider>
);

export default JoinPage;
