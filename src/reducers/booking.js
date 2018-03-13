import { BOOKING_SET } from '../constants/AC';

const INITIAL_STATE = {
   booking: {}
}

const applySetBooking = (state, action) => ({
    ...state,
    booking: action.booking
})

function bookingReducer(state = INITIAL_STATE, action) {
    switch(action.type) {

      case BOOKING_SET: {
        return applySetBooking(state, action)
      }

      default : return state
    }
}
  
export default bookingReducer