import React from "react";
import classnames from "classnames";

export default props => (
  <div className={classnames(props.className)}>
    {props.condition ? props.children : <div className="tag">n/a</div>}
  </div>
);
