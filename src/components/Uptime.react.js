import React from "react";
import moment from "moment";

const Uptime = (props) => {
    return (
        <time>{moment.unix(props.time).format("HH:mm:ss")}</time>
    )
}

export default Uptime;