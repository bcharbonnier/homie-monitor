import React from "react";
import classnames from "classnames";

export default class ActionButton extends React.PureComponent {
    static defaultProps = {
        onClick: () => {}
    }

    state = {
        open: false
    }

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
        this.setState(({open}) => ({
            open: !open
        }));
    }

    render() {
        const { label, children, onClick } = this.props;
        const { open } = this.state;
        const styles = {
            transform: "translateX(-100%)",
            "marginLeft": "28px",
            "marginTop": "1px"
        };
        if (open) {
            styles["display"] = "block";
        }
        return (
            <div className="field has-addons action-button">
                <p className="control">
                    <a 
                        className="button is-info is-small"
                        onClick={(e) => onClick(e)}
                    >{label}</a>
                </p>
                <p className="control">
                    <a 
                        className={classnames("button is-info is-small", {
                            "is-active": open
                        })}
                        ref={toggler => this.toggler = toggler}
                        onClick={(event) => this.toggleState(event)}
                    >
                        <span className="icon is-small">
                            <i className="fa fa-chevron-down" />
                        </span>
                    </a>
                    <span
                        ref={dropdown => this.dropdown = dropdown}
                        className="navbar-dropdown"
                        style={styles}
                        onClick={() => this.toggleState()}
                    >
                        {children}
                    </span>
                </p>
            </div>
        );
    }
}