import {
    
} from '../actions/game'
export function games(
    state = {
        id: null,
        didStart: false,
        players: [],
        rounds: []
    },
    action
) {
    const { rounds, players } = state;
    switch (action.type) {
        default:
            return state;
    }
}