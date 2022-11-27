import React from "react";

const TileButtons = ({ clearTiles, confirmTiles }) => {
  return (
    <div style={{ marginRight: "1em" }}>
      <button onClick={confirmTiles}>Confirm</button>
      <button className="cancel" onClick={clearTiles}>
        Clear
      </button>
    </div>
  );
};

export default TileButtons;
