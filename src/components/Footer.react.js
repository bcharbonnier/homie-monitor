import React from "react";

export default class Footer extends React.PureComponent {
  render() {
    return (
      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>
              <img alt="Homie" src="img/logo.png" />
            </p>
          </div>
        </div>
      </footer>
    );
  }
}
