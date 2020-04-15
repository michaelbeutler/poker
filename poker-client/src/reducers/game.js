import {
    SET_GAME,
    START_GAME,
    ADD_PLAYER,
    REMOVE_PLAYER,
    ADD_ROUND,
    CLEAR_PLAYERS,
    REMOVE_ROUND,
    ROUND_HAND_OUT_CARDS,
    ROUND_FLOP,
    ROUND_TURN,
    ROUND_RIVER
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
        case SET_GAME:
            return Object.assign({}, state, {
                id: action.game.id,
                admin: action.game.admin
            })
        case START_GAME:
            return Object.assign({}, state, {
                didStart: true
            })
        case ADD_PLAYER:
            players.push(action.player);
            return Object.assign({}, state, {
                players: players
            })
        case REMOVE_PLAYER:
            return Object.assign({}, state, {
                players: state.filter(player => { return player !== action.player })
            })
        case CLEAR_PLAYERS:
            return Object.assign({}, state, {
                players: []
            })
        case ADD_ROUND:
            rounds.push(action.round);
            return Object.assign({}, state, {
                rounds
            })
        case REMOVE_ROUND:
            return Object.assign({}, state, {
                rounds: state.filter(rounds => { return rounds !== action.rounds })
            })
        case ROUND_HAND_OUT_CARDS:
            rounds[rounds.length - 1].didHandOut = true;
            rounds[rounds.length - 1].playerCards = action.cards;

            return Object.assign({}, state, {
                rounds,
            })
        case ROUND_FLOP:
            rounds[rounds.length - 1].didFlop = true;
            rounds[rounds.length - 1].dealerCards = action.cards;

            return Object.assign({}, state, {
                rounds
            })
        case ROUND_TURN:
            rounds[rounds.length - 1].didTurn = true;
            rounds[rounds.length - 1].dealerCards = action.cards;

            return Object.assign({}, state, {
                rounds
            })
        case ROUND_RIVER:
            rounds[rounds.length - 1].didRiver = true;
            rounds[rounds.length - 1].dealerCards = action.cards;

            return Object.assign({}, state, {
                rounds
            })
        default:
            return state
    }
}