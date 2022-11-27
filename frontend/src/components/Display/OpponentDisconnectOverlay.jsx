import React from "react";
import ScreenOverlay from "../ScreenOverlay";
import LoadingIcon from "../Icons/LoadingIcon";
import NewGameButton from "../Status/NewGameButton";

const OpponentDisconnectOverlay = ({ name, newGame }) => {
  return (
    <ScreenOverlay>
      <div style={{ fontSize: 52 }}>{name}'s disconnected</div>
      <div
        style={{
          fontSize: 42,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        waiting for player to return
        <LoadingIcon />
      </div>
      <NewGameButton newGame={newGame} />
    </ScreenOverlay>
  );
};

export default OpponentDisconnectOverlay;
