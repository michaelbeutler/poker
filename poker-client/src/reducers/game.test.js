import game from './game'
import * as types from '../actions/game'
const reducer = game;

describe('game reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(
            {
                id: null,
                didStart: false,
                players: [],
                rounds: [],
                isError: false,
                isSuccess: false,
                errorText: null
            }
        )
    })
    it('should handle JOIN_GAME_SUCCESS', () => {
        expect(
            reducer({}, {
                type: types.JOIN_GAME_SUCCESS,
                id: "1234",
            })
        ).toEqual({
            isError: false,
            isSuccess: true,
            id: "1234",
            isReady: false
        })
    })
    it('should handle CREATE_GAME_SUCCESS', () => {
        expect(
            reducer({}, {
                type: types.CREATE_GAME_SUCCESS,
                id: "1234",
            })
        ).toEqual({
            isError: false,
            isSuccess: true,
            id: "1234",
            isReady: false
        })
    })
    it('should handle JOIN_GAME_ERROR', () => {
        expect(
            reducer({}, {
                type: types.JOIN_GAME_ERROR,
                text: "test"
            })
        ).toEqual({
            isSuccess: false,
            isError: true,
            errorText: "test"
        })
    })
    it('should handle CREATE_GAME_ERROR', () => {
        expect(
            reducer({}, {
                type: types.CREATE_GAME_ERROR,
                text: "test"
            })
        ).toEqual({
            isSuccess: false,
            isError: true,
            errorText: "test"
        })
    })
    it('should handle JOIN_GAME', () => {
        expect(
            reducer({ players: [] }, {
                type: types.JOIN_GAME,
                id: "1234",
                username: "test",
                isReady: false
            })
        ).toEqual({
            players: [
                {
                    id: "1234",
                    username: "test",
                    isReady: false
                }
            ]
        })
    })
    it('should handle JOIN_GAME twice', () => {
        expect(
            reducer(
                {
                    players: [{
                        id: "1234",
                        username: "test"
                    }]
                },
                {
                    type: types.JOIN_GAME,
                    id: "12345",
                    username: "test2"
                }
            )
        ).toEqual({
            players: [
                {
                    id: "1234",
                    username: "test"
                },
                {
                    id: "12345",
                    username: "test2"
                }
            ]
        })
    })
    it('should handle LEAVE_GAME', () => {
        expect(
            reducer({
                players: [{
                    id: "1234",
                    username: "test"
                },
                {
                    id: "12345",
                    username: "test2"
                }]
            }, {
                type: types.LEAVE_GAME,
                id: "12345"
            })
        ).toEqual({
            players: [{
                id: "1234",
                username: "test"
            }]
        })
    })
    it('should handle LEAVE_GAME_SUCCESS', () => {
        expect(
            reducer({}, {
                type: types.LEAVE_GAME_SUCCESS
            })
        ).toEqual({
            id: null,
            didStart: false,
            players: [],
            rounds: [],
            isError: false,
            isSuccess: false,
            errorText: null
        })
    })
    it('should handle LEAVE_GAME_ERROR', () => {
        expect(
            reducer({}, {
                type: types.LEAVE_GAME_ERROR,
                text: "test"
            })
        ).toEqual({
            id: null,
            isError: true,
            isSuccess: false,
            errorText: "test"
        })
    })
    it('should handle PLAYER_READY', () => {
        expect(
            reducer({
                players: [{
                    id: "1234",
                    username: "test",
                    isReady: false
                },
                {
                    id: "12345",
                    username: "test2",
                    isReady: false
                }]
            }, {
                type: types.PLAYER_READY,
                id: "1234",
                username: "test",
            })
        ).toEqual({
            players: [{
                id: "1234",
                username: "test",
                isReady: true
            },
            {
                id: "12345",
                username: "test2",
                isReady: false
            }]
        })
    })
    it('should handle PLAYER_READY_SUCCESS', () => {
        expect(
            reducer({}, {
                type: types.PLAYER_READY_SUCCESS
            })
        ).toEqual({
            isReady: true
        })
    })
    it('should handle PLAYER_READY_ERROR', () => {
        expect(
            reducer({}, {
                type: types.PLAYER_READY_ERROR,
                text: "test"
            })
        ).toEqual({
            isReady: false
        })
    })
    it('should handle PLAYER_NOT_READY', () => {
        expect(
            reducer({
                players: [{
                    id: "1234",
                    username: "test",
                    isReady: true
                },
                {
                    id: "12345",
                    username: "test2",
                    isReady: false
                }]
            }, {
                type: types.PLAYER_NOT_READY,
                id: "1234",
                username: "test",
            })
        ).toEqual({
            players: [{
                id: "1234",
                username: "test",
                isReady: false
            },
            {
                id: "12345",
                username: "test2",
                isReady: false
            }]
        })
    })
    it('should handle PLAYER_NOT_READY_SUCCESS', () => {
        expect(
            reducer({}, {
                type: types.PLAYER_NOT_READY_SUCCESS
            })
        ).toEqual({
            isReady: false
        })
    })
    it('should handle PLAYER_NOT_READY_ERROR', () => {
        expect(
            reducer({}, {
                type: types.PLAYER_NOT_READY_ERROR,
                text: "test"
            })
        ).toEqual({
            isReady: false
        })
    })
    it('should handle GAME_START', () => {
        expect(
            reducer({}, {
                type: types.GAME_START,
                id: "1234"
            })
        ).toEqual({
            didStart: true
        })
    })
})