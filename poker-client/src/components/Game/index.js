import React, { Component } from 'react';
import { connect } from 'react-redux'

import io from 'socket.io-client'
import {
    LOGIN, LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_REQUIRED, loginSuccess, loginError, loginRequired
} from '../../actions/login'

import Card, { BackCard } from '../Card';
import './game.scss';

/**
 * Game Component
 * @augments {Component<Props, State>}
 */
class Game extends Component {
    constructor(props) {
        super(props);
        this.state = { socket: io.connect("http://tmr3:3001") };
        const { socket } = this.state;

        // login was successfully
        socket.on(LOGIN_SUCCESS, data => {
            Object.assign(data, { id: socket.id });
            this.props.dispatch(loginSuccess(data));
        });
        // login was not successfully
        socket.on(LOGIN_ERROR, data => {
            this.props.dispatch(loginError(data));
        });
        // login required
        socket.on(LOGIN_REQUIRED, data => {
            this.props.dispatch(loginRequired(data));
        });

        this.emit = this.emit.bind(this);
    }
    emit(event, data) {
        const { socket } = this.state;
        Object.assign(data, { id: socket.id });
        socket.emit(event, data);
    }
    render() {
        if (this.props.login.isLogin) {
            return <>logged in as {this.props.username}</>;
        } else if (this.props.login.isError) {
            return <>
                <button onClick={() => {this.emit(LOGIN, { username: prompt() })}}>Login</button>
                ERROR: {this.props.login.errorText}
            </>;
        } else {
            return <><button onClick={() => {this.emit(LOGIN, { username: prompt() })}}>Login</button></>;
        }
    }
};

function mapStateToProps(state) {
    const { games, login } = state;
    return {
        game: games,
        login: { ...login },
        username: login.username,
    }
}

export default connect(mapStateToProps)(Game)