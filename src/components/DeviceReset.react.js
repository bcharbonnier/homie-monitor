import React from "react";

const DeviceReset = (props) => {
    return (
        <article className="message is-danger">
            <div className="message-header">
                <p>Reset confirmation needed</p>
                <button
                    onClick={() => props.history.goBack()}
                    className="delete"></button>
            </div>
            <div className="message-body">
                <div className="level">
                    <div className="level-left">
                        <p className="level-item">
                            Do you really want to send the `reset` command to this device ?
                        </p>
                    </div>
                    <div className="level-right">
                        <button className="button is-danger">Reset</button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default DeviceReset;