import {
    LOGIN_SUCCESS, LOGIN_ERROR, LOGIN_REQUIRED
} from '../actions/login'
export function login(
    state = {
        id: null,
        isLogin: false,
        username: null,
        isError: false,
        isSuccess: false,
        errorText: null
    },
    action
) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isSuccess: true,
                isLogin: true,
                id: action.id,
                username: action.username,
                isError: false
            });
        case LOGIN_REQUIRED:
        case LOGIN_ERROR:
            return Object.assign({}, state, {
                isLogin: false,
                isError: true,
                errorText: action.text
            });
        default:
            return state;
    }
}