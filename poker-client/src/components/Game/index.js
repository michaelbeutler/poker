import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dealer from '../Dealer';
import Player from '../Player';
import Card from '../Card';
import BackCard from '../Card/back';
import { CLUBS, DIAMONDS, HEARTS, SPADES } from '../Card/constants';
import './game.scss';

/**
 * Game Component
 * @augments {Component<Props, State>}
 */
export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [{ name: "Me", cards: [] }, { name: "Bot", cards: [] }, { name: "Bot2", cards: [] }, { name: "Bot3", cards: [] }, { name: "Bot4", cards: [] }, { name: "Bot5", cards: [] }],
            dealer: [],
            stock: [],
            rounds: [{ didFlop: false, didTurn: false, didHandOut: false }]
        };

        this.startRound = this.startRound.bind(this);
        this.shuffle = this.shuffle.bind(this);
        this.getCard = this.getCard.bind(this);
        this.flop = this.flop.bind(this);
        this.turn = this.turn.bind(this);
        this.river = this.river.bind(this);
        this.handOutCardsToPlayers = this.handOutCardsToPlayers.bind(this);
    }
    componentDidMount() {
        // generate deck
        const suits = [CLUBS, DIAMONDS, HEARTS, SPADES];
        const { stock } = this.state;
        suits.forEach(suit => {
            [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"].forEach(rank => {
                stock.push({ suit, rank });
            });
        });
        this.setState({ ...this.state, stock });
        this.shuffle();
    }
    startRound() {
        const { rounds } = this.state;
        rounds.push({ didFlop: false });
        this.setState({ ...this.state, rounds });
    }
    shuffle() {
        const { stock } = this.state;
        stock.forEach((card, index) => {
            const randomIndex = Math.floor(Math.random() * stock.length);
            stock[index] = stock[randomIndex];
            stock[randomIndex] = card;
        });
        this.setState({ ...this.state, stock });
    }
    getCard(n) {
        const { stock } = this.state;
        const cards = stock.splice(0, n);
        this.setState({ ...this.state, stock });
        return cards;
    }
    handOutCardsToPlayers() {
        if (!this.state.rounds[this.state.rounds.length - 1].didHandOut) {
            const { players, rounds } = this.state;
            players.forEach(player => {
                player.cards = this.getCard(2);
            });
            rounds[rounds.length - 1].didHandOut = true;
            this.setState({ ...this.state, players });
        }
    }
    flop() {
        if (!this.state.rounds[this.state.rounds.length - 1].didFlop) {
            const { dealer, rounds } = this.state;
            this.getCard(3).forEach(card => {
                dealer.push(card);
            });
            rounds[rounds.length - 1].didFlop = true;
            this.setState({ ...this.state, dealer, rounds });
        }
    }
    turn() {
        if (!this.state.rounds[this.state.rounds.length - 1].didTurn) {
            const { dealer, rounds } = this.state;
            this.getCard(1).forEach(card => {
                dealer.push(card);
            });
            rounds[rounds.length - 1].didTurn = true;
            this.setState({ ...this.state, dealer, rounds });
        }
    }
    river() {
        if (!this.state.rounds[this.state.rounds.length - 1].didRiver) {
            const { dealer, rounds } = this.state;
            this.getCard(1).forEach(card => {
                dealer.push(card);
            });
            rounds[rounds.length - 1].didRiver = true;
            this.setState({ ...this.state, dealer, rounds });
        }
    }
    render() {
        return (
            <div className="game">
                <Dealer cards={this.state.dealer} />
                <div style={{ display: 'flex', alignItems: 'stretch', alignContent: 'stretch', width: '100%' }}>
                    {this.state.players.map((player, index) => (
                        <Player key={index} name={player.name} cards={player.cards} />
                    ))}
                </div>
                <h1>Stock ({this.state.stock.length})</h1>
                <div style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
                    {this.state.stock.map((card, index) => (
                        <BackCard key={index} />
                    ))}
                </div>
                <button onClick={() => { this.shuffle() }}>Shuffle</button>
                <button onClick={() => { this.flop() }} disabled={this.state.rounds[this.state.rounds.length - 1].didFlop}>Flop</button>
                <button onClick={() => { this.turn() }} disabled={this.state.rounds[this.state.rounds.length - 1].didTurn}>Turn</button>
                <button onClick={() => { this.river() }} disabled={this.state.rounds[this.state.rounds.length - 1].didRiver}>River</button>
                <button onClick={() => { this.handOutCardsToPlayers(); }} disabled={this.state.rounds[this.state.rounds.length - 1].didHandOut}>Hand out</button>
            </div>
        )
    }
};

Game.propTypes = {

};