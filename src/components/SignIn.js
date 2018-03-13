import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { auth, db } from '../firebase';
import { getValueByProp } from '../utils'
import * as routes from '../constants/routes';

const SignInPage = ({ history }) =>
	<div>
		<h1>Войти</h1>
		<SignInForm history={history} />
		<PasswordForgetLink />
		<SignUpLink />
	</div>

	const INITIAL_STATE = {
		email: '',
		password: '',
		error: null,
	};

	class SignInForm extends Component {
	constructor(props) {
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	onSubmit = (event) => {
		const {
			email,
			password,
		} = this.state;

		const { history } = this.props;

		auth.doSignInWithEmailAndPassword(email, password)
		.then(() => {
			history.push(routes.HOME);
			this.setState(() => ({ ...INITIAL_STATE }));
		})
		.catch(error => {
			this.setState(getValueByProp('error', error));
		});

		event.preventDefault();
	}

	onClick = (provider) => (event) => {
		auth.doSignInWithProvider(provider)
			.then((result) => {
				const user = result.user;
				db.doCreateUser(user.uid, user.displayName, user.email, user.photoURL)
			})
			.catch((error) => {
				this.setState(getValueByProp('error', error))
			})

		event.preventDefault()
	}

	render() {
		const {
			email,
			password,
			error,
		} = this.state;

		const isInvalid =
			password === '' ||
			email === '';

		return (
			<div>
				<form onSubmit={this.onSubmit}>
					<input
						value={email}
						onChange={event => this.setState(getValueByProp('email', event.target.value))}
						type="text"
						placeholder="Email Address"
					/>
					<input
						value={password}
						onChange={event => this.setState(getValueByProp('password', event.target.value))}
						type="password"
						placeholder="Password"
					/>
					<button disabled={isInvalid} type="submit">
						Sign In
					</button>

					{ error && <p>{error.message}</p> }
				</form>
				<input 
					type="submit"
					value="Google"
					onClick={this.onClick(auth.providerGoogle)}
					className="social-sign-in google"
				/>
			</div>
		);
	}

}

export default withRouter(SignInPage);

export {
    SignInForm,
};