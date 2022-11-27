import React from "react";
import "./Log.css";
import LogListItem from "./LogListItem";
import useScrollToBottom from "../../hooks/useScrollToBottom";

const LogList = ({ messages }) => {
  const log = useScrollToBottom(messages);

  const elms = messages.map(({ time, message }, index) => {
    return <LogListItem {...{ time, message, key: index }} />;
  });

  return (
    <div className="log-display">
      <div className="logs" style ={{color:'white'}} ref={log}>
        {elms}
      </div>
    </div>
  );
};

export default LogList;
