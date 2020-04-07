import React, { Component } from 'react';

import './card.scss';

/**
 * Back Card Component
 * @augments {Component<Props, State>}
 */
export default class BackCard extends Component {
    render() {
        return (
            <div className={`card card-back`}>
            </div>
        )
    }
};