import React, { Component } from 'react';
import { connect } from 'react-redux'

import io from 'socket.io-client'
import { startGame, setGame, addPlayer, clearPlayers, addRound, playerBet, smallBlind, bigBlind, handOutCards } from '../../actions/game'

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
        socket.on('SET_GAME', data => {
            this.props.dispatch(setGame(data.id, data.admin));
        });

        socket.on('SET_GAME_ERROR', data => {
            alert(`unable to join game\r\n${data.id}`);
        });

        socket.on('JOIN_GAME_ERROR', data => {
            console.error(data.text);
        });

        socket.on('GAME_START', () => {
            this.props.dispatch(startGame());
        });

        socket.on('ROUND_PLAYER_BET', data => {
            this.props.dispatch(playerBet(data.players));
        });

        socket.on('ROUND_SMALL_BLIND', data => {
            this.props.dispatch(smallBlind(data.pot));
        });

        socket.on('ROUND_BIG_BLIND', data => {
            this.props.dispatch(bigBlind(data.pot));
        });

        socket.on('ROUND_HAND_OUT_CARDS', data => {
            this.props.dispatch(handOutCards(data.cards));
        });

        socket.on('ROUND_START', data => {
            this.props.dispatch(addRound(data.round));
        });

        socket.on('ADD_PLAYER', data => {
            console.log(`player ${data.player.id} joined`);
            this.props.dispatch(addPlayer(data.player));
        });

        socket.on('reconnect', (attemptNumber) => {
            this.props.dispatch(clearPlayers());
            if (this.props.game.id) { socket.emit('JOIN_GAME', { id: this.props.game.id }) };
        });
    }
    render() {
        const { socket } = this.state;
        const { rounds, id, admin, didStart } = this.props.game;
        const currentRound = rounds[rounds.length - 1];
        let currentRoundPlayerCount = 0
        if (currentRound) {
            currentRoundPlayerCount = Object.keys(currentRound.players).length;
        }

        return (
            <div className="game">
                {didStart && rounds.length > 0 ? <div className="poker-table">
                    <div className="poker-table-row poker-table-row-top">
                        <div className="margin-auto float-left poker-table-top-bottom-left poker-table-top-left transform-top-left">
                            <div className="card-container width-calc">
                                {currentRoundPlayerCount > 6 && currentRound.didHandOut ? <>
                                    <BackCard />
                                    <BackCard />
                                </> : ""}
                            </div>
                        </div>
                        <div className="float-left poker-table-top">
                        </div>
                        <div className="margin-auto float-right poker-table-top-bottom-right poker-table-top-right transform-top-right">
                            <div className="card-container width-calc">
                                {currentRoundPlayerCount > 5 && currentRound.didHandOut ? <>
                                    <BackCard />
                                    <BackCard />
                                </> : ""}
                            </div>
                        </div>
                    </div>

                    <div className="poker-table-row">
                        <div className="float-left poker-table-center-left transform-center-left">
                            <div className="card-container width-calc">
                                {currentRoundPlayerCount > 4 && currentRound.didHandOut ? <>
                                    <BackCard />
                                    <BackCard />
                                </> : ""}
                            </div>
                        </div>
                        <div className="float-left poker-table-center">
                            <div className="card-container-center width-calc-center">
                                <div className="card card-back float-left"></div>
                                <div className="card card-back float-left"></div>
                                <div className="card card-back float-left"></div>
                                <div className="card card-back float-left"></div>
                                <div className="card card-back float-left"></div>
                                {rounds[rounds.length - 1].pot}
                            </div>
                        </div>
                        <div className="float-left poker-table-center-right transform-center-right">
                            <div className="card-container width-calc">
                                {currentRoundPlayerCount > 3 && currentRound.didHandOut ? <>
                                    <BackCard />
                                    <BackCard />
                                </> : ""}
                            </div>
                        </div>
                    </div>

                    <div className="poker-table-row poker-table-row-bottom">
                        <div className="margin-auto float-left poker-table-top-bottom-left poker-table-bottom-left transform-top-right">
                            <div className="card-container width-calc">
                                {currentRoundPlayerCount > 2 && currentRound.didHandOut ? <>
                                    <BackCard />
                                    <BackCard />
                                </> : ""}
                            </div>
                        </div>
                        <div className="float-left poker-table-bottom-center">
                            <div className="card-container width-calc">
                                {currentRoundPlayerCount > 1 && currentRound.didHandOut ? <>
                                    <BackCard />
                                    <BackCard />
                                </> : ""}
                            </div>
                        </div>
                        <div className="float-left poker-table-bottom-center">
                            <div className="card-container width-calc">
                                {currentRoundPlayerCount > 0 && currentRound.didHandOut ? <>
                                    {rounds[rounds.length - 1].playerCards.map((card, index) => (
                                        <Card suit={card.suit} rank={card.rank} key={index} />
                                    ))}
                                </> : ""}
                            </div>
                        </div>
                        <div
                            className="margin-auto float-right poker-table-top-bottom-right poker-table-bottom-right transform-top-left">
                            <div className="card-container width-calc">
                                {currentRoundPlayerCount > 7 && currentRound.didHandOut ? <>
                                    <BackCard />
                                    <BackCard />
                                </> : ""}
                            </div>
                        </div>
                    </div>
                </div> : ""}
                <div className="poker-control">
                    {!didStart &&
                        <>
                            <button onClick={() => { socket.emit('LOGIN', {id: socket.id, username: prompt('username')}) }}>Login</button>
                            <button onClick={() => { socket.emit('CREATE_GAME') }}>Neu</button>
                            <button onClick={() => { this.props.dispatch(clearPlayers()); socket.emit('JOIN_GAME', { id: prompt('id') }); }}>Beitreten</button>
                            <button onClick={() => { socket.emit('START_GAME', { id }) }} disabled={!admin}>Starten</button>
                        </>
                    }
                    {id ? id : "no game joined"} - <b>{admin ? "admin" : "user"}</b> - {didStart ? "started" : "not started yet"}<br />
                    {socket.id ? `my id: ${socket.id}` : "n/a"} - {socket.connected ? "connected" : "disconnected"}
                </div>
            </div>
        )
    }
};

function mapStateToProps(state) {
    const { games } = state;
    return {
        game: games
    }
}

export default connect(mapStateToProps)(Game)