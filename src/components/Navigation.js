import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from './SignOut';
import * as routes from '../constants/routes';

const Navigation = (props) =>
	<div>
		{ props.user
			? <NavigationAuth />
			: <NavigationNonAuth />
		}
	</div>

const NavigationAuth = (props) =>
	<ul>
		<li><Link to={routes.LANDING}>Главная</Link></li>
		<li><Link to={routes.HOME}>Домой</Link></li>
		<li><Link to={routes.COURSES}>Бизнес-курсы</Link></li>
		<li><Link to={routes.TRAINING}>Тренинги</Link></li>
		<li><Link to={routes.MASTER_CLASSES}>Мастер-классы</Link></li>	
		<li><Link to={routes.ACCOUNT}>Личный кабинет</Link></li>
		<li><SignOutButton /></li>
	</ul>

const NavigationNonAuth = () =>
	<ul>
		<li><Link to={routes.LANDING}>Главная</Link></li>
		<li><Link to={routes.HOME}>Домой</Link></li>
		<li><Link to={routes.COURSES}>Курсы</Link></li>
		<li><Link to={routes.TRAINING}>Тренинги</Link></li>
		<li><Link to={routes.MASTER_CLASSES}>Мастер-классы</Link></li>	
		<li><Link to={routes.SIGN_IN}>Sign In</Link></li>
	</ul>

export default Navigation;