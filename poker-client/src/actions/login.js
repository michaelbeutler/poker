export const LOGIN = 'LOGIN';
export const LOGIN_REQUIRED = 'LOGIN_REQUIRED';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const loginSuccess = data => {
    return {
        type: LOGIN_SUCCESS,
        username: data.username,
        id: data.id
    }
}

export const loginError = data => {
    return {
        type: LOGIN_ERROR,
        text: data.text
    }
}

export const loginRequired = data => {
    return {
        type: LOGIN_REQUIRED,
        text: data.text
    }
}