import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnchor,
  faFerry,
  faXmark,
  faBomb,
} from "@fortawesome/free-solid-svg-icons";
import { MISSED, SELECTED, CONFIRMED, HIT } from "../../../../constants";

const CoordinateListItem = ({ clickHandler, state }) => {
  const { type, shipName } = state;
  const className = shipName ? `square ${shipName}` : "square";
  return (
    <div className={className} onClick={clickHandler}>
      {type === SELECTED && <FontAwesomeIcon icon={faAnchor} color="white" />}
      {type === CONFIRMED && <FontAwesomeIcon icon={faFerry} />}
      {type === MISSED && <FontAwesomeIcon icon={faXmark} />}
      {type === HIT && <FontAwesomeIcon icon={faBomb} color="white" />}
    </div>
  );
};

export default CoordinateListItem;
