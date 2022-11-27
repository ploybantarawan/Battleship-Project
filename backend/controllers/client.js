import { clientKey } from "../helpers/index.js";

const client = (clients, clientNames, scores, socket, io) => {
  const getSocketById = (id) => io.sockets.sockets.get(id);

  const addClient = (avoidOpponent) => {
    const key = clientKey(clients);
    for (let i = 0; i < key.length; i++) {
      const otherSocketId = key[i];
      const otherSocketOpponent = clients[otherSocketId];
      if (!otherSocketOpponent && otherSocketId !== avoidOpponent) {
        clients[otherSocketId] = socket.id;
        clients[socket.id] = otherSocketId;
        i = key.length;
        getSocketById(otherSocketId).emit(
          "opponent",
          socket.id,
          clientNames[socket.id]
        );
      }
    }
    const key2 = clientKey(clients);
    if (!key2.includes(socket.id)) {
      clients[socket.id] = null;
    }
    //important
    const opponentSocketId = clients[socket.id];
    socket.emit("opponent", opponentSocketId, clientNames[opponentSocketId]);
  };

  const removeClient = () => {
    const otherSocketId = clients[socket.id];
    if (otherSocketId) {
      clients[otherSocketId] = null;
      getSocketById(otherSocketId).emit("opponent", null);
    }
    delete clients[socket.id];
  };

  const newSession = (playerName, sameOpponent=false) => {
    const opponent = clients[socket.id];
    if ( !sameOpponent ){
      removeClient();
      scores[socket.id] = 0
      if ( opponent ){
        scores[opponent] = 0
      }
    }
    addClient(opponent);
    if (playerName) {
      clientNames[socket.id] = playerName;
    }
    console.log('scores', scores)
  };

  const terminateSession = (position, score) => {
    getSocketById(clients[socket.id]).emit("end", position, score);
  };

  return { addClient, removeClient, newSession, terminateSession };
};

export default client;
