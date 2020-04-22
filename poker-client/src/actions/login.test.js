import * as actions from './login'

describe('actions for login', () => {
    it('should create an action to set login success', () => {
        const data = { username: "test", id: "1234" }
        const expectedAction = {
            type: actions.LOGIN_SUCCESS,
            ...data
        }
        expect(actions.loginSuccess(data)).toEqual(expectedAction)
    })
    it('should create an action to set login error', () => {
        const data = { text: "test" }
        const expectedAction = {
            type: actions.LOGIN_ERROR,
            ...data
        }
        expect(actions.loginError(data)).toEqual(expectedAction)
    })
    it('should create an action to set login request', () => {
        const data = { text: "test" }
        const expectedAction = {
            type: actions.LOGIN_REQUIRED,
            ...data
        }
        expect(actions.loginRequired(data)).toEqual(expectedAction)
    })
});