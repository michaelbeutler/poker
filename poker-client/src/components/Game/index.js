import React, { Component } from 'react';
import { connect } from 'react-redux'

import {
    LOGIN
} from '../../actions/login'

import './game.scss';
import { CREATE_GAME, JOIN_GAME, LEAVE_GAME, PLAYER_READY, PLAYER_NOT_READY} from '../../actions/game';

/**
 * Game Component
 * @augments {Component<Props, State>}
 */
class Game extends Component {
    render() {
        // deconstruct props
        const { login, game, emit } = this.props;

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
                    <button onClick={() => { emit(LEAVE_GAME, { id: game.id }) }}>Leave</button>
                    {game.isReady ? <button onClick={() => { emit(PLAYER_NOT_READY, { id: game.id }) }}>Not Ready</button>
                        : <button onClick={() => { emit(PLAYER_READY, { id: game.id }) }}>Ready</button>}
                </>;
            }
            return <>
                logged in as {this.props.username}<br />
                <button onClick={() => { emit(CREATE_GAME) }}>Create</button>
                <button onClick={() => { emit(JOIN_GAME, { id: prompt() }) }}>Join</button><br />
                {game.isError ? game.errorText : ""}
            </>;
        } else if (login.isError) {
            return <>
                <button onClick={() => { emit(LOGIN, { username: prompt() }) }}>Login</button>
                ERROR: {login.errorText}
            </>;
        } else {
            return <><button onClick={() => { emit(LOGIN, { username: prompt() }) }}>Login</button></>;
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