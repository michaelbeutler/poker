export const ADD_PLAYER = 'ADD_PLAYER';
export const REMOVE_PLAYER = 'REMOVE_PLAYER';

export const ADD_ROUND = 'ADD_ROUND';
export const REMOVE_ROUND = 'REMOVE_ROUND';

export const ROUND_HAND_OUT_CARDS = 'ROUND_HAND_OUT_CARDS';
export const ROUND_FLOP = 'ROUND_FLOP';
export const ROUND_TURN = 'ROUND_TURN';
export const ROUND_RIVER = 'ROUND_RIVER';

export function addRound(round) {
    return {
        type: ADD_ROUND,
        round
    }
}

export function handOutCards(cards) {
    return {
        type: ROUND_HAND_OUT_CARDS,
        cards
    }
}

export function roundFlop(cards) {
    return {
        type: ROUND_FLOP,
        cards
    }
}

export function roundTurn(cards) {
    return {
        type: ROUND_TURN,
        cards
    }
}
export function roundRiver(cards) {
    return {
        type: ROUND_RIVER,
        cards
    }
}