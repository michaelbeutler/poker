import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CLUBS, DIAMONDS, HEARTS, SPADES } from './constants';
import './card.scss';

/**
 * Card Component
 * @augments {Component<Props, State>}
 */
export default class Card extends Component {
    render() {
        let suit = "";
        let isRed = false;
        switch (this.props.suit) {
            case CLUBS:
                suit = "♣";
                break;
            case DIAMONDS:
                suit = "♦"
                isRed = true;
                break;
            case HEARTS:
                suit = "♥";
                isRed = true;
                break;
            case SPADES:
                suit = "♠";
                break;
            default:
                throw new Error("invalid suit");
        }
        return (
            <div className={`card${isRed ? " card-red" : ""}`}>
                <div className="card-rank">{this.props.rank}</div>
                <div className="card-suit">{suit}</div>
                <div className="card-rank">{this.props.rank}</div>
            </div>
        )
    }
};

Card.propTypes = {
    /** Defines rank of the card. */
    rank: PropTypes.oneOf([2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"]).isRequired,
    /** Defines suit of the card. */
    suit: PropTypes.oneOf([CLUBS, DIAMONDS, HEARTS, SPADES]).isRequired
};