import login from './login'
import * as types from '../actions/login'
const reducer = login;

describe('login reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(
            {
                id: null,
                isLogin: false,
                username: null,
                isError: false,
                isSuccess: false,
                errorText: null
            }
        )
    })
    it('should handle LOGIN_SUCCESS', () => {
        expect(
            reducer({}, {
                type: types.LOGIN_SUCCESS,
                id: "1234",
                username: "test"
            })
        ).toEqual({
            id: "1234",
            isLogin: true,
            username: "test",
            isError: false,
            isSuccess: true,
        })
    })
    it('should handle LOGIN_REQUIRED', () => {
        expect(
            reducer({}, {
                type: types.LOGIN_REQUIRED,
                text: "test"
            })
        ).toEqual({
            isLogin: false,
            isError: true,
            errorText: "test"
        })
    })
    it('should handle LOGIN_ERROR', () => {
        expect(
            reducer({}, {
                type: types.LOGIN_ERROR,
                text: "test"
            })
        ).toEqual({
            isLogin: false,
            isError: true,
            errorText: "test"
        })
    })
})