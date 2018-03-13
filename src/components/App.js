import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Navigation from './Navigation';
import Footer from './Footer';
import LandingPage from './Landing';
import SignUpPage from './SignUp';
import SignInPage from './SignIn';
import PasswordForgetPage from './PasswordForget';
import HomePage from './Home';
import CoursesList from './CoursesList';
import EventFullDescription from './EventFullDescription';
import BookingPage from './Booking'
import AccountPage from './Account';
import AdminPage from '../components/Admin';
import CoursesEdit from '../components/Admin/CoursesEdit';
import UsersEdit from '../components/Admin/UsersEdit';
import BookingEdit from '../components/Admin/BookingEdit';

import * as events from '../constants/events';
import * as routes from '../constants/routes';
import { COURSES_SET, USERS_SET, BOOKING_SET } from '../constants/AC';
import { firebase, db } from '../firebase';
import withAuthentication from './withAuthentication';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
		authUser: null
		};
	}

	componentDidMount() {
		firebase.auth.onAuthStateChanged(authUser => {
		  authUser
			? this.setState(() => ({ authUser }))
			: this.setState(() => ({ authUser: null }));
		});

		const { onSetCourses, onSetUsers, onSetBooking } = this.props;
		Object.keys(events).map(key => db.doAddListenerToRef(db.coursesRef, events[key], onSetCourses));
		Object.keys(events).map(key => db.doAddListenerToRef(db.usersRef, events[key], onSetUsers));
		Object.keys(events).map(key => db.doAddListenerToRef(db.bookingRef, events[key], onSetBooking));
	}

	render(){
		const { courses, users, booking } = this.props

		return (
			<Router>
				<div>
					<Navigation user={this.state.authUser}/>
					<hr/>
					<Route
						exact path={routes.LANDING}
						component={() => <LandingPage />}
					/>
					<Route
						exact path={routes.SIGN_UP}
						component={() => <SignUpPage />}
					/>
					<Route
						exact path={routes.SIGN_IN}
						component={() => <SignInPage />}
					/>
					<Route
						exact path={routes.PASSWORD_FORGET}
						component={() => <PasswordForgetPage />}
					/>
					<Route
						exact path={routes.HOME}
						component={() => <HomePage />}
					/>
					<Route
						exact path={routes.COURSES}
						component={() => <CoursesList courses={courses} type="pro" />}
					/>
					<Route
						exact path={routes.TRAINING}
						component={() => <CoursesList courses={courses} type="business" />}
					/>
					<Route
						exact path={routes.MASTER_CLASSES}
						component={() => <CoursesList courses={courses} type="master" />}
					/>
					<Route
						exact path="/full/:id"
						component={(params) => <EventFullDescription courseId={params.match.params.id} courses={courses} />}
					/>
					<Route
						exact path={`${routes.BOOKING}/:id`}
						component={(params) => <BookingPage courseId={params.match.params.id} user={this.state.authUser} />}
					/>
					<Route
						exact path={routes.ACCOUNT}
						component={() => <AccountPage />}
					/>
					<Route
						exact path={routes.ADMIN}
						component={() => <AdminPage />}
					/>
					<Route
						exact path={routes.USERS_EDIT}
						component={() => <UsersEdit users={users} />}
                    />
                    <Route
                        exact path={routes.COURSES_EDIT}
                        component={() => <CoursesEdit courses={courses} />}
                    />
					<Route
						exact path={routes.BOOKING_EDIT}
						component={() => <BookingEdit booking={booking}/>}
					/>
				
					<Footer />
				</div>
			</Router>
		)
	}
}

const mapStateToProps = (state) => ({
	courses: state.coursesState.courses,
	users: state.usersState.users,
	booking: state.bookingState.booking,
})
  
const mapDispatchToProps = (dispatch) => ({
	onSetCourses: (courses) => dispatch({ 
		type: COURSES_SET, 
		courses }),
	onSetUsers: (users) => dispatch({
		type: USERS_SET,
		users
	}),
	onSetBooking: (booking) => dispatch({
		type: BOOKING_SET,
		booking
	})
})

export default compose(
	withAuthentication,
	connect(mapStateToProps, mapDispatchToProps)
)(App);