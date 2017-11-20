import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.react";
import Flux from "./libs/Flux";

import "font-awesome/css/font-awesome.min.css";
import "bulma/css/bulma.css";
import "./index.css";

Flux.initialize();

ReactDOM.render(<App />, document.getElementById("root"));
