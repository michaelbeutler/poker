import { combineReducers } from 'redux'
import { games } from './game'
import { login } from './login';

const rootReducer = combineReducers({
    games,
    login
})

export default rootReducer