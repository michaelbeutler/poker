import * as actions from './login'

describe('actions for login', () => {
    it('should create an action to set login success', () => {
        const data = {
            username: "Test",
            id: "1234"
        }
        const expectedAction = {
            type: actions.LOGIN_SUCCESS,
            ...data
        }
        expect(actions.loginSuccess(data)).toEqual(expectedAction)
    })
    it('should create an action to set login failure', () => {
        const data = {
            text: "Test"
        }
        const expectedAction = {
            type: actions.LOGIN_ERROR,
            ...data
        }
        expect(actions.loginError(data)).toEqual(expectedAction)
    })
});