import React, { Component } from 'react';
import { connect } from 'react-redux'

import io from 'socket.io-client'
import {
    LOGIN, LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_REQUIRED, loginSuccess, loginError, loginRequired
} from '../../actions/login'

import './game.scss';
import { CREATE_GAME, CREATE_GAME_ERROR, CREATE_GAME_SUCCESS, createGameSuccess, createGameError, JOIN_GAME, JOIN_GAME_ERROR, JOIN_GAME_SUCCESS, joinGame, joinGameSuccess, joinGameError, leaveGame, LEAVE_GAME, LEAVE_GAME_SUCCESS, LEAVE_GAME_ERROR, leaveGameError, leaveGameSuccess, PLAYER_READY, playerReady, PLAYER_NOT_READY, PLAYER_READY_SUCCESS, PLAYER_READY_ERROR, playerReadyError, playerReadySuccess, playerNotReady, PLAYER_NOT_READY_SUCCESS, playerNotReadySuccess, playerNotReadyError, PLAYER_NOT_READY_ERROR, GAME_START, gameStart, GAME_NEW_ROUND, gameNewRound, UPDATE_PLAYERS, updatePlayers } from '../../actions/game';

/**
 * Game Component
 * @augments {Component<Props, State>}
 */
class Game extends Component {
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

        this.emit = this.emit.bind(this);
    }
    emit(event, data = {}) {
        const { socket } = this.state;
        Object.assign(data, { socketId: socket.id });
        socket.emit(event, data);
    }
    render() {
        // deconstruct props
        const { login, game } = this.props;

        if (login.isLogin) {
            if (game.isSuccess) {
                if (game.didStart && game.rounds.length > 0) {
                    const currentRound = game.rounds[game.rounds.length - 1];
                    return <>
                        {game.id}<br />
                        {currentRound.players.map((player, index) => (
                            <li key={index}><b>{player.username}</b> - {player.bet}$ - {player.isDealer ? "D " : ""}{player.isSmallBlind ? "S " : ""}{player.isBigBlind ? "B " : ""}</li>
                        ))}<br />
                    </>
                }
                return <>
                    {game.id}<br />
                    <li><b>You</b> - {game.isReady ? "ready" : "not ready"}</li>
                    {game.players.map((player, index) => (
                        <li key={index}><b>{player.username}</b> - {player.isReady ? "ready" : "not ready"}</li>
                    ))}<br />
                    <button onClick={() => { this.emit(LEAVE_GAME, { id: game.id }) }}>Leave</button>
                    {game.isReady ? <button onClick={() => { this.emit(PLAYER_NOT_READY, { id: game.id }) }}>Not Ready</button>
                        : <button onClick={() => { this.emit(PLAYER_READY, { id: game.id }) }}>Ready</button>}
                </>;
            }
            return <>
                logged in as {this.props.username}<br />
                <button onClick={() => { this.emit(CREATE_GAME) }}>Create</button>
                <button onClick={() => { this.emit(JOIN_GAME, { id: prompt() }) }}>Join</button><br />
                {game.isError ? game.errorText : ""}
            </>;
        } else if (login.isError) {
            return <>
                <button onClick={() => { this.emit(LOGIN, { username: prompt() }) }}>Login</button>
                ERROR: {login.errorText}
            </>;
        } else {
            return <><button onClick={() => { this.emit(LOGIN, { username: prompt() }) }}>Login</button></>;
        }
    }
};

function mapStateToProps(state) {
    const { game, login } = state;
    return {
        game,
        login: { ...login },
        username: login.username,
    }
}

export default connect(mapStateToProps)(Game)