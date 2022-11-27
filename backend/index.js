import game from "./controllers/game.js";
import client from "./controllers/client.js";
import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: ["http://localhost:4000"],
  },
});

const clients = {};
const clientNames = {};
const scores = {};

var numOnlineClients = 0

function updateNumOnlineClients(count){
  numOnlineClients += count
}

io.on("connection", (socket) => {
  const { sendShips, sendShot, sendOpponentTimeOut, randomFirstPlayer, winGame } = game(clients, scores, socket, io);
  const { addClient, removeClient, newSession, terminateSession } = client(
    clients,
    clientNames,
    scores,
    socket,
    io
  );
  
  addClient();

  updateNumOnlineClients(1);

  socket.on("newGame", newSession);

  socket.on("ships", sendShips);

  socket.on("shot", sendShot);

  socket.on("end", terminateSession);

  socket.on('opponentTimeOut', sendOpponentTimeOut);

  socket.on('randomFirstPlayer', randomFirstPlayer)

  socket.on('winGame', winGame)

  socket.on("disconnect", function(){
    removeClient();
    updateNumOnlineClients(-1);
  });

  socket.on('resetGame', function(){
    Object.values(clients).forEach(playerSocketId => {
      if ( playerSocketId && playerSocketId != socket.id ){
        io.sockets.sockets.get(playerSocketId).emit('resetGame')
      }
    })
  })

  socket.on('numOnlineClients', function(){
    socket.emit('numOnlineClients', numOnlineClients)
  })

});


io.listen(4000);
