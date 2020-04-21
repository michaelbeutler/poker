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
    switch (action.type) {
        default:
            return state;
    }
}