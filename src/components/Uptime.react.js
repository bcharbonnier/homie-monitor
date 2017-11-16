import React from "react";
import moment from "moment";


export default class Uptime extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            time: props.time
        };
    }

    componentWillMount() {
        this.refreshId = setInterval(() => {
            this.setState(({time}) => ({
                time: time + 1
            }))
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.refreshId);
    }

    render() {
        return (
            <time>{moment.unix(this.state.time).format("D[d] HH:mm:ss")}</time>
        )
    }
}
