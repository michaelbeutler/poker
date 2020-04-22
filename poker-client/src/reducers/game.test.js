import { game } from './game'
import * as types from '../actions/game'

describe('game reducer', () => {
    it('should return the initial state', () => {
        expect(game(undefined, {})).toEqual(
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
            game({}, {
                type: types.JOIN_GAME_SUCCESS,
                id: "1234",
            })
        ).toEqual({
            isError: false,
            isSuccess: true,
            id: "1234"
        })
    })
    it('should handle CREATE_GAME_SUCCESS', () => {
        expect(
            game({}, {
                type: types.CREATE_GAME_SUCCESS,
                id: "1234",
            })
        ).toEqual({
            isError: false,
            isSuccess: true,
            id: "1234"
        })
    })
    it('should handle JOIN_GAME_ERROR', () => {
        expect(
            game({}, {
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
            game({}, {
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
            game({ players: [] }, {
                type: types.JOIN_GAME,
                id: "1234",
                username: "test"
            })
        ).toEqual({
            players: [
                {
                    id: "1234",
                    username: "test"
                }
            ]
        })
    })
    it('should handle JOIN_GAME twice', () => {
        expect(
            game(
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
            game({
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
            game({}, {
                type: types.LEAVE_GAME_SUCCESS
            })
        ).toEqual({
            id: null,
            isError: false,
            isSuccess: false
        })
    })
    it('should handle LEAVE_GAME_ERROR', () => {
        expect(
            game({}, {
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
})