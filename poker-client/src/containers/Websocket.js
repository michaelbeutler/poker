import React, { Component } from 'react'
import { connect } from 'react-redux'

import io from 'socket.io-client'
import Game from '../components/Game';

import {
    LOGIN, LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_REQUIRED, loginSuccess, loginError, loginRequired
} from '../actions/login'

import {
    CREATE_GAME_ERROR,
    CREATE_GAME_SUCCESS,
    createGameSuccess,
    createGameError,
    JOIN_GAME,
    JOIN_GAME_ERROR,
    JOIN_GAME_SUCCESS,
    joinGame,
    joinGameSuccess,
    joinGameError,
    leaveGame,
    LEAVE_GAME,
    LEAVE_GAME_SUCCESS,
    LEAVE_GAME_ERROR,
    leaveGameError,
    leaveGameSuccess,
    PLAYER_READY,
    playerReady,
    PLAYER_NOT_READY,
    PLAYER_READY_SUCCESS,
    PLAYER_READY_ERROR,
    playerReadyError,
    playerReadySuccess,
    playerNotReady,
    PLAYER_NOT_READY_SUCCESS,
    playerNotReadySuccess,
    playerNotReadyError,
    PLAYER_NOT_READY_ERROR,
    GAME_START,
    gameStart,
    GAME_NEW_ROUND,
    gameNewRound,
    UPDATE_PLAYERS,
    updatePlayers,
    HAND_OUT_CARDS,
    handOutCards
} from '../actions/game';


export class Websocket extends Component {
    constructor(props) {
        super(props);
        this.state = { socket: io.connect("http://localhost:3001") };
        const { socket } = this.state;

        socket.on('reconnect', numberOfAttempts => {
            if (this.props.login.isLogin) {
                this.emit(LOGIN, { username: this.props.login.username });
                alert(`reconnected after ${numberOfAttempts} tries`);
            }
        });

        // deconstruct props
        const { dispatch } = this.props;

        // login was successfully
        socket.on(LOGIN_SUCCESS, data => {
            Object.assign(data, { id: socket.id });
            dispatch(loginSuccess(data));
        });
        // login was not successfully
        socket.on(LOGIN_ERROR, data => {
            dispatch(loginError(data));
        });
        // login required
        socket.on(LOGIN_REQUIRED, data => {
            dispatch(loginRequired(data));
        });


        // create game was successfully
        socket.on(CREATE_GAME_SUCCESS, data => {
            dispatch(createGameSuccess(data));
        });
        // create game was not successfully
        socket.on(CREATE_GAME_ERROR, data => {
            dispatch(createGameError(data));
        });


        // join game
        socket.on(JOIN_GAME, data => {
            dispatch(joinGame(data));
        });
        socket.on(JOIN_GAME_SUCCESS, data => {
            dispatch(joinGameSuccess(data));
        });
        // join game was not successfully
        socket.on(JOIN_GAME_ERROR, data => {
            dispatch(joinGameError(data));
        });


        // leave game
        socket.on(LEAVE_GAME, data => {
            dispatch(leaveGame(data));
        });
        // leave game was successfully
        socket.on(LEAVE_GAME_SUCCESS, data => {
            dispatch(leaveGameSuccess(data));
        });
        // leave game was not successfully
        socket.on(LEAVE_GAME_ERROR, data => {
            dispatch(leaveGameError(data));
        });


        // player ready
        socket.on(PLAYER_READY, data => {
            dispatch(playerReady(data));
        });
        // player ready was successfully
        socket.on(PLAYER_READY_SUCCESS, data => {
            dispatch(playerReadySuccess(data));
        });
        // player ready was not successfully
        socket.on(PLAYER_READY_ERROR, data => {
            dispatch(playerReadyError(data));
        });


        // player not ready
        socket.on(PLAYER_NOT_READY, data => {
            dispatch(playerNotReady(data));
        });
        // player not ready was successfully
        socket.on(PLAYER_NOT_READY_SUCCESS, data => {
            dispatch(playerNotReadySuccess(data));
        });
        // player not ready was not successfully
        socket.on(PLAYER_NOT_READY_ERROR, data => {
            dispatch(playerNotReadyError(data));
        });


        // game start
        socket.on(GAME_START, data => {
            dispatch(gameStart(data));
        });
        // game new round
        socket.on(GAME_NEW_ROUND, data => {
            dispatch(gameNewRound(data));
        });


        // update players
        socket.on(UPDATE_PLAYERS, data => {
            dispatch(updatePlayers(data));
        });

        // hand out cards
        socket.on(HAND_OUT_CARDS, data => {
            dispatch(handOutCards(data));
        });

        this.emit = this.emit.bind(this);
    }
    emit(event, data = {}) {
        const { socket } = this.state;
        Object.assign(data, { socketId: socket.id });
        socket.emit(event, data);
    }
    render() {
        return (
            <div>
                <Game emit={this.emit} />
            </div>
        )
    }
}

export default connect()(Websocket)
