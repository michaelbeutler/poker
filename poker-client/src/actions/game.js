export const CREATE_GAME = 'CREATE_GAME';
export const CREATE_GAME_ERROR = 'CREATE_GAME_ERROR';
export const CREATE_GAME_SUCCESS = 'CREATE_GAME_SUCCESS';

export const JOIN_GAME = 'JOIN_GAME';
export const JOIN_GAME_ERROR = 'JOIN_GAME_ERROR';
export const JOIN_GAME_SUCCESS = 'JOIN_GAME_SUCCESS';

export const LEAVE_GAME = 'LEAVE_GAME';
export const LEAVE_GAME_ERROR = 'LEAVE_GAME_ERROR';
export const LEAVE_GAME_SUCCESS = 'LEAVE_GAME_SUCCESS';

export const PLAYER_READY = 'PLAYER_READY';
export const PLAYER_READY_ERROR = 'PLAYER_READY_ERROR';
export const PLAYER_READY_SUCCESS = 'PLAYER_READY_SUCCESS';

export const PLAYER_NOT_READY = 'PLAYER_NOT_READY';
export const PLAYER_NOT_READY_ERROR = 'PLAYER_NOT_READY_ERROR';
export const PLAYER_NOT_READY_SUCCESS = 'PLAYER_NOT_READY_SUCCESS';

export const GAME_START = 'GAME_START';
export const GAME_NEW_ROUND = 'GAME_NEW_ROUND';

export const UPDATE_PLAYERS = 'UPDATE_PLAYERS';                // {players: []}
export const UPDATE_PLAYERS_ERROR = 'UPDATE_PLAYERS_ERROR';

export const UPDATE_POT = 'UPDATE_POT';                        // {pot: n}
export const UPDATE_POT_ERROR = 'UPDATE_POT_ERROR';

export const HAND_OUT_CARDS = 'HAND_OUT_CARDS';                // {cards: []}
export const HAND_OUT_CARDS_ERROR = 'HAND_OUT_CARDS_ERROR';

export const SMALL_BLIND = 'SMALL_BLIND';                      // {}
export const SMALL_BLIND_ERROR = 'SMALL_BLIND_ERROR';

export const BIG_BLIND = 'BIG_BLIND';                          // {}
export const BIG_BLIND_ERROR = 'BIG_BLIND_ERROR';

export const createGameSuccess = data => {
    return {
        type: CREATE_GAME_SUCCESS,
        id: data.id
    }
}

export const createGameError = data => {
    return {
        type: CREATE_GAME_ERROR,
        text: data.text
    }
}

export const joinGameSuccess = data => {
    return {
        type: JOIN_GAME_SUCCESS,
        id: data.id
    }
}

export const joinGame = data => {
    return {
        type: JOIN_GAME,
        id: data.id, 
        username: data.username,
        isReady: data.isReady
    }
}

export const joinGameError = data => {
    return {
        type: JOIN_GAME_ERROR,
        text: data.text
    }
}

export const leaveGame = data => {
    return {
        type: LEAVE_GAME,
        id: data.id,
        username: data.username
    }
}

export const leaveGameSuccess = data => {
    return {
        type: LEAVE_GAME_SUCCESS
    }
}

export const leaveGameError = data => {
    return {
        type: LEAVE_GAME_ERROR,
        text: data.text
    }
}

export const playerReady = data => {
    return {
        type: PLAYER_READY,
        id: data.id,
        username: data.username
    }
}

export const playerReadySuccess = data => {
    return {
        type: PLAYER_READY_SUCCESS,
        id: data.id
    }
}

export const playerReadyError = data => {
    return {
        type: PLAYER_READY_ERROR,
        text: data.text
    }
}

export const playerNotReady = data => {
    return {
        type: PLAYER_NOT_READY,
        id: data.id,
        username: data.username
    }
}

export const playerNotReadySuccess = data => {
    return {
        type: PLAYER_NOT_READY_SUCCESS,
        id: data.id
    }
}

export const playerNotReadyError = data => {
    return {
        type: PLAYER_NOT_READY_ERROR,
        text: data.text
    }
}

export const gameStart = data => {
    return {
        type: GAME_START,
        id: data.id
    }
}

export const gameNewRound = data => {
    return {
        type: GAME_NEW_ROUND,
        id: data.id
    }
}

export const updatePlayersError = data => {
    return {
        type: UPDATE_PLAYERS_ERROR,
        text: data.text
    }
}

export const updatePlayers = data => {
    return {
        type: UPDATE_PLAYERS,
        players: data.players
    }
}

export const handOutCardsError = data => {
    return {
        type: HAND_OUT_CARDS_ERROR,
        text: data.text
    }
}

export const handOutCards = data => {
    return {
        type: HAND_OUT_CARDS,
        cards: data.cards,
        dealerCards: data.dealerCards,
        id: data.id
    }
}