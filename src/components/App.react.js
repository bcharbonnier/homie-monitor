import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./Navbar.react";
import Footer from "./Footer.react";

import Dashboard from "./Dashboard.react";
import Devices from "./Devices.react";
import DeviceDetails from "./DeviceDetails.react";
import Firmwares from "./Firmwares.react";
import ConsoleLog from "./ConsoleLog.react";
import Notifications from "./Notifications.react";
import PropertiesExplorer from "./PropertiesExplorer.react";
import ActionsExplorer from "./ActionsExplorer.react";

export default class App extends React.PureComponent {
  render() {
    return (
      <Router>
        <div>
          <div className="container main-nav">
            <Navbar />
          </div>
          <Notifications />
          <section className="section main-section">
            <Route exact path="/" component={Dashboard} />
            <Route path="/devices" component={Devices} />
            <Route exact path="/devices/:deviceId" component={DeviceDetails} />
            <Route path="/firmwares" component={Firmwares} />
            <Route path="/console" component={ConsoleLog} />
            <Route path="/explorer/properties" component={PropertiesExplorer} />
            <Route path="/explorer/actions" component={ActionsExplorer} />
          </section>
          <Footer />
        </div>
      </Router>
    );
  }
}
