import React, { Component } from 'react';
import { connect } from 'react-redux'

import Dealer from '../Dealer';
import Player from '../Player';
import { CLUBS, DIAMONDS, HEARTS, SPADES } from '../Card/constants';
import './game.scss';

import { addRound, roundFlop, roundTurn, roundRiver, handOutCards } from '../../actions/game'
import io from 'socket.io-client'

let socket;
/**
 * Game Component
 * @augments {Component<Props, State>}
 */
class Game extends Component {
    componentDidMount() {
        socket = io.connect("http://localhost:3001");

        socket.on('ROUND_HAND_OUT_CARDS', data => {
            this.props.dispatch(handOutCards(data.cards));
        });

        socket.on('ROUND_START', data => {
            this.props.dispatch(addRound(data.round));
        });
    }
    handOutCardsToPlayers() {
        this.props.dispatch(handOutCards([
            { suit: HEARTS, rank: 8 },
            { suit: HEARTS, rank: 6 }
        ]))
    }
    flop() {
        this.props.dispatch(roundFlop([
            { suit: SPADES, rank: 10 },
            { suit: HEARTS, rank: 2 },
            { suit: SPADES, rank: 5 }
        ]))
    }
    turn() {
        this.props.dispatch(roundTurn([
            { suit: SPADES, rank: 10 },
            { suit: HEARTS, rank: 2 },
            { suit: SPADES, rank: 5 },
            { suit: CLUBS, rank: 'A' }
        ]))
    }
    river() {
        this.props.dispatch(roundRiver([
            { suit: SPADES, rank: 10 },
            { suit: HEARTS, rank: 2 },
            { suit: SPADES, rank: 5 },
            { suit: CLUBS, rank: 'A' },
            { suit: SPADES, rank: 10 }
        ]))
    }
    render() {
        const { rounds } = this.props.games;
        return (
            <div className="game">
                <Dealer cards={rounds[rounds.length - 1].dealerCards} />
                <div style={{ display: 'flex', alignItems: 'stretch', alignContent: 'stretch', width: '100%' }}>
                    <Player name={"You"} cards={rounds[rounds.length - 1].playerCards} />
                </div>

                <div style={{ position: 'absolute', bottom: '20px' }}>
                    <button onClick={() => { this.handOutCardsToPlayers(); }} disabled={rounds[rounds.length - 1].didHandOut}>Hand out</button>
                    <button onClick={() => { this.flop() }} disabled={rounds[rounds.length - 1].didFlop}>Flop</button>
                    <button onClick={() => { this.turn() }} disabled={rounds[rounds.length - 1].didTurn}>Turn</button>
                    <button onClick={() => { this.river() }} disabled={rounds[rounds.length - 1].didRiver}>River</button>
                    <button onClick={() => { socket.emit('CREATE_GAME') }}>Neu</button>
                    <button onClick={() => { socket.emit('JOIN_GAME', { id: prompt('id') }) }}>Beitreten</button>
                </div>
            </div>
        )
    }
};

function mapStateToProps(state) {
    const { games } = state;

    return {
        games
    }
}

export default connect(mapStateToProps)(Game)