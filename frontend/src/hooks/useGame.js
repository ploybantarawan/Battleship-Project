import io, { Socket } from "socket.io-client";
import { useReducer, useEffect, useState } from "react";
import {
  checkIfSameCoordinate,
  makeNewMessages,
  makeMsgForWrongTiles,
  validateShipTiles,
  makeMsgForSelectingTiles,
  checkIfLstIncludesCoordinate,
  isWinner,
  getLastElm,
  findSinkShipNameOfCoordinate,
  makeMsgForSinkShip,
  makeMsgForShot,
  countScore,
  tossCoin,
  isShipCoordinate,
} from "../helpers";
import {
  NEW_OPPONENT,
  NEW_MESSAGE,
  NEW_GAME,
  OPPONENT_LEFT,
  initialState,
  INITIAL_MSG_NO_OPPONENT,
  INITIAL_MSG_HAVE_OPPONENT,
  MSG_HAVE_OPPONENT,
  MSG_NO_OPPONENT,
  ships,
  CLEAR_TILES,
  SELECT_TILE,
  CONFIRM_TILES,
  MSG_INVALID_TILES,
  COMPLETE_SELECTION,
  SET_OPPONENT_SHIPS,
  OPPONENTS_TURN,
  MSG_ATTACK,
  MSG_DEFEND,
  MSG_WAITING_FOR_PLAYER,
  MSG_LOSE,
  MSG_WIN,
  MSG_OPPONENT_PLACING_SHIPS,
  MSG_ENTER_NEW_GAME,
  SHOT,
  OPPONENT_SHOT,
  END,
  OPPONENT_TIMEOUT,
  TIMEOUT,
  SET_TURN,
  OVERALL_SCORE
} from "../constants";
import BombSound from "../assets/sound/bomb.wav"
import useSound from "use-sound";

/**
 * 
 * @param {Socket<DefaultEventsMap, DefaultEventsMap>} socket 
 * @returns 
 */
const useGame = (socket) => {
  const reducers = {
    [NEW_OPPONENT](state, { opponent, opponentName }) {
      const newGameState = opponent ? 1 : 0;
      
      if ( opponent && opponent == state.opponent ){
        return {
          ...initialState(),
          opponent: state.opponent,
          opponentName: state.opponentName,
          gotInitialOpponent: true,
          gameState: newGameState
        }
      }

      return {
        ...state,
        opponent,
        opponentName: opponentName ? opponentName : state.opponentName,
        gotInitialOpponent: state.gameState > 0,
        gameState: newGameState,
      };
    },
    [NEW_MESSAGE](state, { message }) {
      const { messages } = state;
      const newMessages = makeNewMessages(messages, message);
      return { ...state, haveSendInitialMsg: true, messages: newMessages };
    },
    [NEW_GAME](state) {
      const { messages, opponent } = state;
      const newMessages = makeNewMessages(messages, MSG_ENTER_NEW_GAME);
      return { ...initialState(), messages: newMessages, opponent };
    },
    [OPPONENT_LEFT](state) {
      const { messages } = state
      return {
        ...initialState(),
        messages,
        haveSendInitialMsg: true,
        playerName: state.playerName,
        opponentName: state.opponentName,
        gameState: -1 // opponent left
      };
    },
    [CLEAR_TILES](state) {
      return { ...state, chosenTiles: [] };
    },
    [SELECT_TILE](state, { coordinate: selectedCoordinate }) {
      const { myShips, chosenTiles } = state;
      for (const { coordinates } of myShips) {
        const isOccupied = checkIfLstIncludesCoordinate(
          coordinates,
          selectedCoordinate
        );
        if (isOccupied) return state;
      }

      const isSelected = checkIfLstIncludesCoordinate(
        chosenTiles,
        selectedCoordinate
      );
      const newChosenTiles = isSelected
        ? chosenTiles.filter(
          (coordinate) =>
            !checkIfSameCoordinate(coordinate, selectedCoordinate)
        )
        : chosenTiles.concat([selectedCoordinate]);

      return { ...state, chosenTiles: newChosenTiles };
    },
    [CONFIRM_TILES](state) {
      const { shipTilesState, chosenTiles, messages, myShips } = state;
      const { name, numOfTiles } = ships[shipTilesState];
      const numOfChosenTiles = chosenTiles.length;

      const wrongNumOfTiles = numOfTiles !== numOfChosenTiles;
      if (wrongNumOfTiles) {
        const newMsg = makeMsgForWrongTiles(name, numOfTiles);
        const newMessages = makeNewMessages(messages, newMsg);
        return { ...state, messages: newMessages };
      }

      const sameRow = validateShipTiles(chosenTiles, "row", "column");
      const sameColumn = validateShipTiles(chosenTiles, "column", "row");

      if (!sameRow && !sameColumn) {
        const newMessages = makeNewMessages(messages, MSG_INVALID_TILES);
        return { ...state, messages: newMessages };
      }

      const newShip = { name, coordinates: chosenTiles };
      const newMyShips = myShips.concat([newShip]);
      const newShipTilesState = shipTilesState + 1;

      return {
        ...state,
        myShips: newMyShips,
        shipTilesState: newShipTilesState,
        chosenTiles: [],
      };
    },
    [COMPLETE_SELECTION](state) {
      return { ...state, gameState: 2 };
    },
    [SET_OPPONENT_SHIPS](state, { opponentShips }) {
      const { gameState } = state;
      const newGameState = gameState === 2 ? 3 : gameState;
      return { ...state, opponentShips, gameState: newGameState };
    },
    [OPPONENTS_TURN](state) {
      return { ...state, gameState: 4 };
    },
    [SHOT](state, { coordinate }) {
      const { opponentShipsShot, opponentShips } = state;
      const alreadyShot = checkIfLstIncludesCoordinate(
        opponentShipsShot,
        coordinate
      );
      if (alreadyShot) return state;

      const isHitShip = isShipCoordinate(coordinate, opponentShips)

      const newOpponentShipsShot = opponentShipsShot.concat([coordinate]);
      const hasWon = isWinner(opponentShips, newOpponentShipsShot);

      const msgType = hasWon ? "end" : "shot";
      const newGameState = hasWon ? 5 : isHitShip ? 3 : 4;
      const newScore = countScore(opponentShips, newOpponentShipsShot)
      socket.emit(msgType, coordinate, newScore, isHitShip);

      return {
        ...state,
        opponentShipsShot: newOpponentShipsShot,
        gameState: newGameState,
        score: newScore
      };
    },
    [OPPONENT_SHOT](state, { coordinate, opponentScore, isHitShip }) {
      const newOpponentScore = opponentScore ? opponentScore : state.opponentScore 
      const { myShipsShot } = state;
      const newMyShipsShot = myShipsShot.concat([coordinate]);
      return {
        ...state,
        opponentScore: newOpponentScore,
        myShipsShot: newMyShipsShot,
        gameState: isHitShip ? 4 : 3,
      };
    },
    [TIMEOUT](state) {

      socket.emit('opponentTimeOut', '1');

      return {
        ...state,
        gameState: 4
      }
    },
    [OPPONENT_TIMEOUT](state) {
      return {
        ...state,
        gameState: 3
      }
    },
    [SET_TURN](state, {gameState}) {
      return {
        ...state,
        gameState
      }
    },
    [END](state) {
      return { ...state, gameState: 6 };
    },
    [OVERALL_SCORE](state, {myOverallScore, opponentOverallScore}) {
      return {
        ...state,
        myOverallScore,
        opponentOverallScore
      }
    }
  };

  const reducer = (state, action) => {
    return reducers[action.type](state, action) || state;
  };

  const [state, dispatch] = useReducer(reducer, initialState());
  const [playerName, setPlayerName] = useState(localStorage.getItem(socket.id))
  const [playBombSound] = useSound(BombSound)

  const {
    gotInitialOpponent,
    opponent,
    haveSendInitialMsg,
    gameState,
    myShips,
    opponentShips,
    messages,
    shipTilesState,
    chosenTiles,
    opponentShipsShot,
    myShipsShot,
    score,
    opponentName,
    opponentScore,
    myOverallScore,
    opponentOverallScore
  } = state;

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server");
    });

    socket.on("opponent", (opponent, opponentName) => {
      dispatch({ opponent, opponentName, type: NEW_OPPONENT });
    });

    socket.on("opponentShips", (opponentShips) => {
      dispatch({ type: SET_OPPONENT_SHIPS, opponentShips });
    });

    socket.on("shot", (coordinate, opponentScore, isHitShip) => {
      dispatch({ type: OPPONENT_SHOT, coordinate, opponentScore, isHitShip });
    });

    socket.on("end", (coordinate, opponentScore) => {
      dispatch({ type: OPPONENT_SHOT, coordinate, opponentScore });
      dispatch({ type: END });
    });

    socket.on("opponentTimeOut", () => {
      dispatch({ type: OPPONENT_TIMEOUT })
    });

    socket.on("resetGame", () => {
      dispatch({ type: NEW_GAME })
    });

    socket.on("setTurn", (gameState) => {
      dispatch({ type: SET_TURN, gameState })
    })

    socket.on("opponentLeft", () => {
      dispatch({ type: OPPONENT_LEFT })
    })

    socket.on('overallScore', (myOverallScore, opponentOverallScore) => {
      dispatch({ type: OVERALL_SCORE, myOverallScore, opponentOverallScore })
    })

    return () => {
      socket.off("connect");
      socket.off("opponent");
      socket.off("opponentShips");
      socket.off("shot");
      socket.off("end");
      socket.off('opponentTimeOut');
      socket.off('resetGame');
      socket.off('setTurn')
      socket.off('opponentLeft')
      socket.off('overallScore')
    };
  }, []);

  useEffect(() => {
    if (gotInitialOpponent) {
      const message = opponent
        ? haveSendInitialMsg
          ? MSG_HAVE_OPPONENT
          : INITIAL_MSG_HAVE_OPPONENT
        : haveSendInitialMsg
          ? MSG_NO_OPPONENT
          : INITIAL_MSG_NO_OPPONENT;

      dispatch({ type: NEW_MESSAGE, message });
      if (!opponent) dispatch({ type: OPPONENT_LEFT });
    }
  }, [opponent, gotInitialOpponent, haveSendInitialMsg]);

  useEffect(() => {
    switch (gameState) {
      case 1:
        const { numOfTiles, name } = ships[0];
        dispatch({
          type: NEW_MESSAGE,
          message: makeMsgForSelectingTiles(name, numOfTiles),
        });
        break;
      case 2:
        socket.emit("ships", myShips);
        if (opponentShips) {
          socket.emit('randomFirstPlayer')
          return
        }
        dispatch({ type: NEW_MESSAGE, message: MSG_OPPONENT_PLACING_SHIPS });
        break;
      case 3:
        const opponentLastShot = getLastElm(myShipsShot);
        if (opponentLastShot) {
          const shotMsg = makeMsgForShot(false, myShips, opponentLastShot);
          dispatch({ type: NEW_MESSAGE, message: shotMsg });

          const justSinkShipName = findSinkShipNameOfCoordinate(
            myShips,
            opponentLastShot,
            myShipsShot
          );
          if (justSinkShipName) {
            const sinkMsg = makeMsgForSinkShip(false, justSinkShipName);
            dispatch({ type: NEW_MESSAGE, message: sinkMsg });
          }
        }
        dispatch({ type: NEW_MESSAGE, message: MSG_ATTACK });
        break;
      case 4:
        const myLastShot = getLastElm(opponentShipsShot);
        if (myLastShot) {
          const shotMsg = makeMsgForShot(true, opponentShips, myLastShot);
          dispatch({ type: NEW_MESSAGE, message: shotMsg });

          const justSinkShipName = findSinkShipNameOfCoordinate(
            opponentShips,
            myLastShot,
            opponentShipsShot
          );
          if (justSinkShipName) {
            const sinkMsg = makeMsgForSinkShip(true, justSinkShipName);
            dispatch({ type: NEW_MESSAGE, message: sinkMsg });
          }
        }

        dispatch({ type: NEW_MESSAGE, message: MSG_DEFEND });
        break;
      case 5:
        socket.emit('winGame', socket.id)
        dispatch({ type: NEW_MESSAGE, message: MSG_WIN });
        break;
      case 6:
        dispatch({ type: NEW_MESSAGE, message: MSG_LOSE });
        break;
      default:
    }
  }, [gameState, myShips, myShipsShot, opponentShips, opponentShipsShot]);

  useEffect(() => {
    switch (shipTilesState) {
      case 0:
        break;
      case ships.length:
        dispatch({ type: COMPLETE_SELECTION });
        break;
      default:
        const { numOfTiles, name } = ships[shipTilesState];
        dispatch({
          type: NEW_MESSAGE,
          message: makeMsgForSelectingTiles(name, numOfTiles),
        });
    }
  }, [shipTilesState]);

  const newGame = (playerName) => {
    if ( playerName?.length > 0 ){
      setPlayerName(playerName)
      localStorage.setItem(socket.id, playerName)
      socket.emit("newGame", playerName);
    }
    else {
      socket.emit("newGame");
    }
    dispatch({ type: NEW_GAME });
  };

  const continueGame = () => {
    socket.emit('newGame', null, true)
  }

  const showOpponentOverlay =
    gameState === 0
      ? MSG_WAITING_FOR_PLAYER
      : !opponentShips
        ? MSG_OPPONENT_PLACING_SHIPS
        : null;

  const showMyOverlay = null
    // gameState === 5 ? MSG_WIN : gameState === 6 ? MSG_LOSE : null;

  const showConfirmCancelButtons = gameState === 1;

  const clearTiles = () => {
    dispatch({ type: CLEAR_TILES });
  };

  const clickTile = (myBoard) => {
    if (myBoard) {
      return (coordinate) => {
        if (gameState === 1) dispatch({ type: SELECT_TILE, coordinate });
      };
    }
    return (coordinate) => {
      if (gameState === 3) {
        if ( isShipCoordinate(coordinate, myShips) ){
          playBombSound()
        }
        dispatch({ type: SHOT, coordinate });
      }
    };
  };

  const timeOut = () => {
    dispatch({ type: TIMEOUT })
  }

  const confirmTiles = () => dispatch({ type: CONFIRM_TILES });

  const logState = { messages, newGame, continueGame };

  const myState = {
    myBoard: true,
    placedShips: myShips,
    overlaySettings: showMyOverlay,
    title: playerName ? `${playerName}'s Board` : "Your Board",
    showConfirmCancelButtons,
    clearTiles,
    clickTile: clickTile(true),
    timeOut,
    chosenTiles,
    confirmTiles,
    shot: myShipsShot,
    active: gameState === 4,
    score,
    playerName,
    myOverallScore,
    opponentOverallScore
  };

  const opponentState = {
    placedShips: opponentShips,
    overlaySettings: showOpponentOverlay,
    title: `${opponentName?.length > 0 ? opponentName : "Opponent"}'s Board`,
    clickTile: clickTile(),
    chosenTiles: [],
    shot: opponentShipsShot,
    active: gameState === 3,
    playerName: opponentName,
    score: opponentScore
  };


  return { logState, myState, opponentState, gameState, socket };
};

export default useGame;
