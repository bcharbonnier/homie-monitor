import React from "react";
import { humanize } from "../utils/Time";

export default class Uptime extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: props.time
    };
  }

  componentWillMount() {
    this.refreshId = setInterval(() => {
      this.setState(({ time }) => ({
        time: time + 1
      }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshId);
  }

  render() {
    return <time>{humanize(this.state.time, this.props.short)}</time>;
  }
}
