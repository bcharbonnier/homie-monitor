import React from "react";
import { NavLink as Link } from "react-router-dom";
import classnames from "classnames";

import ConnectionButton from "./ConnectionButton.react";

const NavLink = (props) => {
  return <Link activeClassName="is-active" className="navbar-item" {...props}>{props.children}</Link>;
}

export default class Navbar extends React.Component {
  state = {
    hamburgerActive: false
  }

  toggleHamburger() {
    this.setState(({ hamburgerActive }) => ({ hamburgerActive: !hamburgerActive }));
  }

  mightHideNavbar() {
    if (this.state.hamburgerActive) {
      this.toggleHamburger();
    }
  }

  render() {
    const { hamburgerActive } = this.state;
    return (
      <nav className="navbar has-shadow">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <strong>Homie</strong>Sentinel
          </Link>
          <div className={classnames("navbar-burger burger", {
            "is-active": hamburgerActive
          })} onClick={() => this.toggleHamburger()}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className={classnames("navbar-menu", {
            "is-active": hamburgerActive
          })} onClick={() => this.mightHideNavbar()}>
          <div className="navbar-start">
            <NavLink to="/devices">Devices</NavLink>
            <NavLink to="/firmwares">Firmwares</NavLink>
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">Explorers</a>
              <div className="navbar-dropdown is-boxed">
                <NavLink to="/explorer/properties">Node Properties</NavLink>
                <NavLink to="/explorer/actions">Node Actions</NavLink>
              </div>
            </div>
            <NavLink to="/console">Console Logs</NavLink>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <ConnectionButton />
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

