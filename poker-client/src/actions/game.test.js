import * as actions from './game'

describe('actions for game', () => {
    it('should create an action to set create game success', () => {
        const data = { id: "1234" }
        const expectedAction = {
            type: actions.CREATE_GAME_SUCCESS,
            ...data
        }
        expect(actions.createGameSuccess(data)).toEqual(expectedAction)
    })
    it('should create an action to set create game error', () => {
        const data = { text: "1234" }
        const expectedAction = {
            type: actions.CREATE_GAME_ERROR,
            ...data
        }
        expect(actions.createGameError(data)).toEqual(expectedAction)
    })
    it('should create an action to set join game success', () => {
        const data = { id: "1234" }
        const expectedAction = {
            type: actions.JOIN_GAME_SUCCESS,
            ...data
        }
        expect(actions.joinGameSuccess(data)).toEqual(expectedAction)
    })
    it('should create an action to set join game error', () => {
        const data = { text: "1234" }
        const expectedAction = {
            type: actions.JOIN_GAME_ERROR,
            ...data
        }
        expect(actions.joinGameError(data)).toEqual(expectedAction)
    })
    it('should create an action to set join game', () => {
        const data = { id: "1234", username: "test" }
        const expectedAction = {
            type: actions.JOIN_GAME,
            ...data
        }
        expect(actions.joinGame(data)).toEqual(expectedAction)
    })
    it('should create an action to set leave game success', () => {
        const expectedAction = {
            type: actions.LEAVE_GAME_SUCCESS,
        }
        expect(actions.leaveGameSuccess()).toEqual(expectedAction)
    })
    it('should create an action to set leave game error', () => {
        const data = { text: "1234" }
        const expectedAction = {
            type: actions.LEAVE_GAME_ERROR,
            ...data
        }
        expect(actions.leaveGameError(data)).toEqual(expectedAction)
    })
    it('should create an action to set leave game', () => {
        const data = { id: "1234", username: "test" }
        const expectedAction = {
            type: actions.LEAVE_GAME,
            ...data
        }
        expect(actions.leaveGame(data)).toEqual(expectedAction)
    })
    it('should create an action to set ready game success', () => {
        const data = { id: "1234" }
        const expectedAction = {
            type: actions.PLAYER_READY_SUCCESS,
            ...data
        }
        expect(actions.playerReadySuccess(data)).toEqual(expectedAction)
    })
    it('should create an action to set ready game error', () => {
        const data = { text: "test" }
        const expectedAction = {
            type: actions.PLAYER_READY_ERROR,
            ...data
        }
        expect(actions.playerReadyError(data)).toEqual(expectedAction)
    })
    it('should create an action to set ready game', () => {
        const data = { id: "1234", username: "test" }
        const expectedAction = {
            type: actions.PLAYER_READY,
            ...data
        }
        expect(actions.playerReady(data)).toEqual(expectedAction)
    })
    it('should create an action to set not ready game success', () => {
        const data = { id: "1234" }
        const expectedAction = {
            type: actions.PLAYER_NOT_READY_SUCCESS,
            ...data
        }
        expect(actions.playerNotReadySuccess(data)).toEqual(expectedAction)
    })
    it('should create an action to set ready game error', () => {
        const data = { text: "test" }
        const expectedAction = {
            type: actions.PLAYER_NOT_READY_ERROR,
            ...data
        }
        expect(actions.playerNotReadyError(data)).toEqual(expectedAction)
    })
    it('should create an action to set ready game', () => {
        const data = { id: "1234", username: "test" }
        const expectedAction = {
            type: actions.PLAYER_NOT_READY,
            ...data
        }
        expect(actions.playerNotReady(data)).toEqual(expectedAction)
    })
    it('should create an action to set game start', () => {
        const data = { id: "1234" }
        const expectedAction = {
            type: actions.GAME_START,
            ...data
        }
        expect(actions.gameStart(data)).toEqual(expectedAction)
    })
});