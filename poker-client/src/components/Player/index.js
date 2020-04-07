import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Hand from '../Hand';
import './player.scss';

/**
 * Player Component
 * @augments {Component<Props, State>}
 */
export default class Player extends Component {
    render() {
        return (
            <div className="player">
                <h6>{this.props.name}</h6>
                <Hand cards={this.props.cards} />
            </div>
        )
    }
};