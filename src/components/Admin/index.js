import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../../constants/routes';
import withAdminRole from '../withAdminRole';

class AdminPage extends Component {
    render() {
        return (
            <div>
                <h1>Панель администратора</h1>
                <p>Просмотр только для пользователей из группы admins</p>
                <p>Клюшка, все функции редактирования здесь в реальном времени влияют на базу данных. 
                    Если нажмешь на кнопку "Удалить" у пользователя, мероприятия, брони и т.д., то ты их <strong>безвозвратно</strong>, по-настоящему удаляешь. 
                    Пожалуйста, аккуратнее и не говори потом: "Я что-то нажала и все пропало".
                    А лучше пусть твой молодой менеджер нажимает на кнопочки (ты слишком стара для этого дерьма).
                </p>
                <AdminNavigation />
            </div>  
        )
    }
}

const AdminNavigation = () => 
    <ul>
        <li><Link to={routes.USERS_EDIT}>Пользователи</Link></li>
        <li><Link to={routes.COURSES_EDIT}>Мероприятия</Link></li>
        <li><Link to={routes.BOOKING_EDIT}>Бронирования</Link></li>
    </ul>

const AdminLink = () =>
	<p>
		Перейти в панель администратора
		<Link to={routes.ADMIN}>Перейти</Link>
	</p>

export default withAdminRole(AdminPage);

export {
    AdminLink,
    AdminNavigation,
};