import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { db } from '../firebase';
import { PasswordForgetForm } from './PasswordForget';
import withAuthorization from './withAuthorization';

import { AdminLink } from '../components/Admin'

class AccountPage extends Component {

	state = {
		isAdmin: null
	}

	setStateAsync = state =>
    	new Promise(resolve => this.setState(state, resolve))

	async componentDidMount() {
		const { authUser: {uid} } = this.props;
		this.setStateAsync({
			isAdmin: await db.isAdmin(uid).then(snapshot => snapshot.val())
		})
	}

	render() {
		const { authUser } = this.props;
		return (
			<div>
				<h1>Account: {authUser.email} </h1>
				{ this.state.isAdmin ? <AdminLink /> : null }
				<PasswordForgetForm />
			</div>
		)
	}
} 
	
const mapStateToProps = (state) => ({
	authUser: state.sessionState.authUser,
});

const authCondition = (authUser) => !!authUser;

export default compose(
	withAuthorization(authCondition),
	connect(mapStateToProps)
)(AccountPage);