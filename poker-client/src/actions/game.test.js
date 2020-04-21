import * as actions from './game'

describe('actions for game', () => {
    it('should create an action to set create game success', () => {
        const data = {
            id: "1234"
        }
        const expectedAction = {
            type: actions.CREATE_GAME_SUCCESS,
            ...data
        }
        expect(actions.createGameSuccess(data)).toEqual(expectedAction)
    })
});