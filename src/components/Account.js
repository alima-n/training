import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
		const { authUser: {uid} } = this.context;
		this.setStateAsync({
			isAdmin: await db.isAdmin(uid).then(snapshot => snapshot.val())
		})
	}

	render() {
		const { authUser } = this.context
		return (
			<div>
				<h1>Account: {authUser.email} </h1>
				{ this.state.isAdmin ? <AdminLink /> : null }
				<PasswordForgetForm />
			</div>
		)
	}
} 
	
AccountPage.contextTypes = {
		authUser: PropTypes.object,
};

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(AccountPage);