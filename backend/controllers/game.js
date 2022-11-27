const game = (clients, scores, socket, io) => {
  const getSocketById = (id) => io.sockets.sockets.get(id);

  const sendShot = (coordinate, score, isHitShip) => {
    getSocketById(clients[socket.id]).emit("shot", coordinate, score, isHitShip);
  };

  const sendShips = (ships) => {
    getSocketById(clients[socket.id]).emit("opponentShips", ships);
  };

  const sendOpponentTimeOut = () => {
    getSocketById(clients[socket.id]).emit("opponentTimeOut", '1');
  }

  const randomFirstPlayer = () => {
    const player1Socket = socket
    const player2Socket = getSocketById(clients[player1Socket.id])

    const player1GoFirst = Math.random() > 0.5

    if ( player1GoFirst ){
      player1Socket.emit('setTurn', 3)
      player2Socket.emit('setTurn', 4)
    }
    else {
      player1Socket.emit('setTurn', 4)
      player2Socket.emit('setTurn', 3)
    }
  }

  const winGame = (socketId) => {
    if ( !socketId ){
      return 
    }
    if ( scores[socketId] ){
      scores[socketId] += 1;
    }
    else {
      scores[socketId] = 1;
    }
    const otherSocketId = clients[socketId]
    getSocketById(socketId).emit('overallScore', scores[socketId], scores[otherSocketId])
    getSocketById(otherSocketId).emit('overallScore', scores[otherSocketId], scores[socketId])
    console.log('scores', scores)
  }

  return { sendShot, sendShips, sendOpponentTimeOut, randomFirstPlayer, winGame };
};

export default game;
