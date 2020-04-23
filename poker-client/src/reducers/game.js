import {
    CREATE_GAME_SUCCESS, CREATE_GAME_ERROR, JOIN_GAME_SUCCESS, JOIN_GAME_ERROR, LEAVE_GAME_SUCCESS, LEAVE_GAME_ERROR, JOIN_GAME, LEAVE_GAME, PLAYER_READY, PLAYER_READY_SUCCESS, PLAYER_READY_ERROR, GAME_START, PLAYER_NOT_READY, PLAYER_NOT_READY_SUCCESS, PLAYER_NOT_READY_ERROR
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
                id: action.id,
                isReady: false
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
                players: [...state.players, { id: action.id, username: action.username, isReady: action.isReady }]
            });
        case LEAVE_GAME:
            const { players } = state;
            return Object.assign({}, state, {
                players: players.filter(p => { return p.id !== action.id })
            });
        case LEAVE_GAME_SUCCESS:
            return Object.assign({}, state, {
                id: null,
                didStart: false,
                players: [],
                rounds: [],
                isError: false,
                isSuccess: false,
                errorText: null
            });
        case LEAVE_GAME_ERROR:
            return Object.assign({}, state, {
                id: null,
                isError: true,
                isSuccess: false,
                errorText: action.text
            });
        case PLAYER_READY:
            return Object.assign({}, state, {
                players: state.players.map(player => {
                    if (player.id === action.id) {
                        return { ...player, isReady: true };
                    }
                    return player
                })
            });
        case PLAYER_READY_SUCCESS:
            return Object.assign({}, state, {
                isReady: true
            });
        case PLAYER_READY_ERROR:
            return Object.assign({}, state, {
                isReady: false
            });
        case PLAYER_NOT_READY:
            return Object.assign({}, state, {
                players: state.players.map(player => {
                    if (player.id === action.id) {
                        return { ...player, isReady: false };
                    }
                    return player
                })
            });
        case PLAYER_NOT_READY_SUCCESS:
            return Object.assign({}, state, {
                isReady: false
            });
        case PLAYER_NOT_READY_ERROR:
            return Object.assign({}, state, {
                isReady: false
            });
        case GAME_START:
            return Object.assign({}, state, {
                didStart: true
            });
        default:
            return state;
    }
}
export default game;