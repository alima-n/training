import { COURSES_SET } from '../constants/AC';

const INITIAL_STATE = {
   courses: {}
}

const applySetCourses = (state, action) => ({
    ...state,
    courses: action.courses
})

function coursesReducer(state = INITIAL_STATE, action) {
    switch(action.type) {

      case COURSES_SET: {
        return applySetCourses(state, action)
      }

      default : return state
    }
}
  
export default coursesReducer