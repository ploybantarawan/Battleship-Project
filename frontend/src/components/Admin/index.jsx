import io from "socket.io-client";
import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { MdClose } from "react-icons/md";
import playerPanelImg1 from "../../assets/img/1.png";
import playerPanelImg2 from "../../assets/img/2.png";
import shipImg1 from "../../assets/img/ship1.png";
import shipImg2 from "../../assets/img/ship2.png";
import shipImg3 from "../../assets/img/ship3.png";
import shipImg4 from "../../assets/img/ship4.png";
import shipImg5 from "../../assets/img/ship5.png";
import discoveredShipImg1 from "../../assets/img/discovered_ship1.png";
import discoveredShipImg2 from "../../assets/img/discovered_ship2.png";
import discoveredShipImg3 from "../../assets/img/discovered_ship3.png";
import discoveredShipImg4 from "../../assets/img/discovered_ship4.png";
import discoveredShipImg5 from "../../assets/img/discovered_ship5.png";
import "./style.css";

const AdminPageComponent = () => {
  const [selRoomNum, setSelRoomNum] = useState(0);
  const shipInfos = [
    {
      discovered: discoveredShipImg1,
      nondiscovered: shipImg1,
    },
    {
      discovered: discoveredShipImg2,
      nondiscovered: shipImg2,
    },
    {
      discovered: discoveredShipImg3,
      nondiscovered: shipImg3,
    },
    {
      discovered: discoveredShipImg4,
      nondiscovered: shipImg4,
    },
    {
      discovered: discoveredShipImg5,
      nondiscovered: shipImg5,
    },
  ];
  const roomData = [
    {
      id: 1,
      time: "2022-11-14",
      playerInfos: [
        {
          playerId: 1,
          playerName: "ploy",
          score: 100,
          playerPanel: playerPanelImg1,
          discoveredShip: [false, false, true, false, true],
        },
        {
          playerId: 2,
          playerName: "tiny",
          score: 200,
          playerPanel: playerPanelImg2,
          discoveredShip: [true, true, false, false, false],
        },
      ],
    },
    {
      id: 2,
      time: "2022-11-15",
      playerInfos: [
        {
          playerId: 1,
          playerName: "jimmy",
          score: 150,
          playerPanel: playerPanelImg1,
          discoveredShip: [false, true, true, false, true],
        },
        {
          playerId: 2,
          playerName: "marina",
          score: 100,
          playerPanel: playerPanelImg2,
          discoveredShip: [false, false, true, false, true],
        },
      ],
    },
  ];

  const handleSelRoomNum = (event) => {
    setSelRoomNum(event.target.value);
  };

  const handleResetGame = () => {
    const socket = io("172.27.151.178:4000", { transports: ["websocket"] }); // change to your own IP Adress
    socket.emit("resetGame", "1");
    socket.off("resetGame");
  };

  return (
    <div className="admin-page-container">
      <div className="room-number-container">
        <p className="room-number-lablel">Room Number</p>
        <div className="room-number-group">
          <select
            className="room-number-option"
            value={selRoomNum}
            onChange={(e) => handleSelRoomNum(e)}
          >
            {roomData.map((item, i) => (
              <option key={i} value={i}>
                {item.id}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="room-time-label-container">
        <p className="room-time-label">{roomData[selRoomNum].time}</p>
        <MdClose className="room-time-close" />
      </div>
      <div className="room-info-container">
        {roomData[selRoomNum].playerInfos.map((item, i) => {
          return (
            <div key={i} className="player-status-container">
              <div className="player-item-title-container">
                <p className="player-item-name">{item.playerName}</p>
                <p className="player-item-score">Score: {item.score}</p>
              </div>
              <Image src={item.playerPanel} />
              <div className="discovered-ship-status">
                {roomData[selRoomNum].playerInfos[i].discoveredShip.map(
                  (statusItem, j) => (
                    <Image
                      style={{ padding: "5px 0" }}
                      key={j}
                      src={
                        statusItem
                          ? shipInfos[j].discovered
                          : shipInfos[j].nondiscovered
                      }
                    />
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
      <button className="main-button danger" onClick={handleResetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default AdminPageComponent;
