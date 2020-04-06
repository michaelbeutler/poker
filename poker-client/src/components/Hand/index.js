import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card from '../Card';
import './hand.scss';

/**
 * Hand Component
 * @augments {Component<Props, State>}
 */
export default class Hand extends Component {
    render() {
        return (
            <div className="hand">
                {this.props.cards.map((card, index) => (
                    <Card key={index} suit={card.suit} rank={card.rank} />
                ))}
            </div>
        )
    }
};

Hand.defaultProps = {
    cards: []
}

Hand.propTypes = {
    /** Defines the cards inside this hand. */
    cards: PropTypes.array
};