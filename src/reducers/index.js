import { combineReducers } from 'redux';
import coursesReducer from './courses';
import usersReducer from './users';
import bookingReducer from './booking';

const rootReducer = combineReducers({
    coursesState: coursesReducer,
    usersState: usersReducer,
    bookingState: bookingReducer,
});

export default rootReducer;