import {
    CREATE_GAME_SUCCESS, CREATE_GAME_ERROR, JOIN_GAME_SUCCESS, JOIN_GAME_ERROR, LEAVE_GAME_SUCCESS, LEAVE_GAME_ERROR, JOIN_GAME, LEAVE_GAME
} from '../actions/game'
const game = (
    state = {
        id: null,
        didStart: false,
        players: [],
        rounds: [],
        isError: false,
        isSuccess: false,
        errorText: null
    },
    action
) => {
    switch (action.type) {
        case JOIN_GAME_SUCCESS:
        case CREATE_GAME_SUCCESS:
            return Object.assign({}, state, {
                isError: false,
                isSuccess: true,
                id: action.id
            });
        case JOIN_GAME_ERROR:
        case CREATE_GAME_ERROR:
            return Object.assign({}, state, {
                isError: true,
                isSuccess: false,
                errorText: action.text
            });
        case JOIN_GAME:
            return Object.assign({}, state, {
                players: [...state.players, { id: action.id, username: action.username }]
            });
        case LEAVE_GAME:
            const { players } = state;
            return Object.assign({}, state, {
                players: players.filter(p => { return p.id !== action.id })
            });
        case LEAVE_GAME_SUCCESS:
            return Object.assign({}, state, {
                id: null,
                isError: false,
                isSuccess: false
            });
        case LEAVE_GAME_ERROR:
            return Object.assign({}, state, {
                id: null,
                isError: true,
                isSuccess: false,
                errorText: action.text
            });
        default:
            return state;
    }
}
export default game;