import React, { Component } from 'react';

import Card from '../Card';
import './dealer.scss';

/**
 * Dealer Component
 * @augments {Component<Props, State>}
 */
export default class Dealer extends Component {
    render() {
        return (
            <div className="dealer">
                {this.props.cards.map((card, index) => (
                    <Card key={index} suit={card.suit} rank={card.rank} />
                ))}
            </div>
        )
    }
};
