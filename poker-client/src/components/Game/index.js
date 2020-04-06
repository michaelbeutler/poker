import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Hand from '../Hand';
import { CLUBS, HEARTS } from '../Card/constants';
import './game.scss';

/**
 * Game Component
 * @augments {Component<Props, State>}
 */
export default class Game extends Component {
    render() {
        return (
            <div className="game">
                <div className="poker-table">
                    <Hand cards={[{ suit: CLUBS, rank: 5 }, { suit: HEARTS, rank: "A" }]} />
                </div>
            </div>
        )
    }
};

Game.propTypes = {

};