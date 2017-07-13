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
        onClosed: PropTypes.func
    }

    static defaultProps = {
        active: false,
        className: "",
        onClose: () => {},
        onClosed: () => {}
    }

    render() {
        const { 
            active, 
            title,
            children,
            className,
            onClose } = this.props;
        return (
            <div className={classnames("modal", className, {
                "is-active": active
            })}>
                <div className="modal-background"></div>
                <div className="modal-card is-danger">
                    <header className="modal-card-head">
                        <p className="modal-card-title">{title}</p>
                        <button 
                            onClick={(evt) => onClose(evt)}
                            className="delete"></button>
                    </header>
                    <section className="modal-card-body">
                        {children}
                    </section>
                </div>
            </div>
        )
    }
}