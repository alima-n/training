import { combineReducers } from 'redux';
import sessionReducer from './session';
import coursesReducer from './courses';
import usersReducer from './users';
import bookingReducer from './booking';

const rootReducer = combineReducers({
    sessionState: sessionReducer,
    coursesState: coursesReducer,
    usersState: usersReducer,
    bookingState: bookingReducer,
});

export default rootReducer;