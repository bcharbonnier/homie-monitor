import React from "react";
import classnames from "classnames";

export default class ActionButton extends React.PureComponent {
  static defaultProps = {
    onClick: () => {}
  };

  state = {
    open: false
  };

  constructor(props) {
    super(props);
    this.clickOutSide = this.clickOutSide.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener("click", this.clickOutSide);
  }

  componentWillUnmount() {
    document.body.removeEventListener("click", this.clickOutSide);
  }

  clickOutSide(event) {
    const { target } = event;
    if (target === this.toggler || this.toggler.contains(target)) {
      return;
    }
    if (this.dropdown && !this.dropdown.contains(target)) {
      this.setState(() => ({
        open: false
      }));
    }
  }

  toggleState(event) {
    this.setState(({ open }) => ({
      open: !open
    }));
  }

  render() {
    const { label, children, onClick } = this.props;
    const { open } = this.state;
    return (
      <div
        className={classnames(
          "field has-addons action-button dropdown is-right",
          {
            "is-active": open
          }
        )}
      >
        <div className="control">
          <a className="button is-link is-small" onClick={e => onClick(e)}>
            {label}
          </a>
        </div>
        <div className="control dropdown-trigger">
          <a
            className="button is-link is-small"
            ref={toggler => (this.toggler = toggler)}
            onClick={event => this.toggleState(event)}
          >
            <span className="icon is-small">
              <i className="fa fa-chevron-down" />
            </span>
          </a>
          <div
            ref={dropdown => (this.dropdown = dropdown)}
            className="dropdown-menu"
            onClick={() => this.toggleState()}
          >
            <div className="dropdown-content">{children}</div>
          </div>
        </div>
      </div>
    );
  }
}
