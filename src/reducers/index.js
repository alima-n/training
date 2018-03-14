import { combineReducers } from 'redux';
import sessionReducer from './session';
import coursesReducer from './courses';

const rootReducer = combineReducers({
    sessionState: sessionReducer,
    coursesState: coursesReducer,
});

export default rootReducer;