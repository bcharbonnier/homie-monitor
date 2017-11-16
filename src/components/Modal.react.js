import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class Modal extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        title: PropTypes.string.isRequired,
        active: PropTypes.bool,
        children: PropTypes.node.isRequired,
        onClose: PropTypes.func,
        onClosed: PropTypes.func,
        actions: PropTypes.arrayOf(PropTypes.node)
    }

    static defaultProps = {
        active: false,
        className: "",
        onClose: () => {},
        onClosed: () => {},
        actions: []
    }

    render() {
        const {
            active,
            title,
            children,
            actions,
            className,
            onClose } = this.props;
        return (
            <div className={classnames("modal", className, {
                "is-active": active
            })}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{title}</p>
                        <button
                            onClick={(evt) => onClose(evt)}
                            className="delete"
                        ></button>
                    </header>
                    <section className="modal-card-body">
                        {children}
                    </section>
                    {actions.length > 0 && <div className="modal-card-foot">
                        {actions}
                    </div>}
                </div>
            </div>
        )
    }
}