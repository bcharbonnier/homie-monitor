import React from "react";

export default function Fetching(props) {
  return (
    <div className="columns">
      <div className="column">
        {props.active ? (
          <div className="has-text-centered">Fetching firmwares list...</div>
        ) : null}
      </div>
    </div>
  );
}
