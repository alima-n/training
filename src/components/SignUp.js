import React, { Component } from 'react';
import { Link, withRouter, } from 'react-router-dom';

import * as routes from '../constants/routes';
import { auth, db } from '../firebase';
import { getValueByProp } from '../utils';

const SignUpPage = ({ history }) =>
	<div>
		<h1>Регистрация</h1>
		<SignUpForm history={history} />
	</div>

const INITIAL_STATE = {
	username: '',
	email: '',
	passwordOne: '',
	passwordTwo: '',
	error: null,
};

class SignUpForm extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

  	onSubmit = (event) => {
		const {
			username,
			email,
			passwordOne,
		} = this.state;

		const { history } = this.props;
	  
		auth.doCreateUserWithEmailAndPassword(email, passwordOne)
			.then(authUser => {
				const avatar = `https://api.adorable.io/avatars/100/${authUser.uid}.png`;	
				db.doCreateUser(authUser.uid, username, email, avatar)
				.then(() => {
					auth.doUpdateUsername(username);
					auth.doUpdateAvatar(avatar);
					history.push(routes.HOME);
					this.setState(() => ({ ...INITIAL_STATE }));
				})
				.catch(error => {
					this.setState(getValueByProp('error', error));
				});
			})
			.catch(error => {
				this.setState(getValueByProp('error', error));
			});
	  
		event.preventDefault();
	}

  	render() {

		const {
			username,
			email,
			passwordOne,
			passwordTwo,
			error,
		} = this.state;

		const isInvalid =
			passwordOne !== passwordTwo ||
			passwordOne === '' ||
			email === '' ||
			username === '';
		
		return (
		<form onSubmit={this.onSubmit}>
			<input
				value={username}
				onChange={event => this.setState(getValueByProp('username', event.target.value))}
				type="text"
				placeholder="Full Name"
			/>
			<input
				value={email}
				onChange={event => this.setState(getValueByProp('email', event.target.value))}
				type="text"
				placeholder="Email Address"
			/>
			<input
				value={passwordOne}
				onChange={event => this.setState(getValueByProp('passwordOne', event.target.value))}
				type="password"
				placeholder="Password"
			/>
			<input
				value={passwordTwo}
				onChange={event => this.setState(getValueByProp('passwordTwo', event.target.value))}
				type="password"
				placeholder="Confirm Password"
			/>
			<button disabled={isInvalid} type="submit">
				Sign Up
			</button>

			{ error && <p>{error.message}</p> }
		</form>
		);
	}
}

const SignUpLink = () =>
	<p>
		<Link to={routes.SIGN_UP}>Регистрация</Link>
	</p>

export default withRouter(SignUpPage);

export {
	SignUpForm,
	SignUpLink,
};