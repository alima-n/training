import React, { Component } from 'react';
import Async from 'react-promise';
import withAdminRole from '../withAdminRole';
import { db } from '../../firebase';
import EditUserPanel from './EditUserPanel';
import { AdminNavigation } from './';
import Paginator from '../Paginator';
import * as events from '../../constants/events';
import './style.css';

const INITIAL_STATE = {
    users: {},
    booking: {},
    currentPage: 1,
    usersPerPage: 5,
    showEditPanel: '',
}

class UsersEdit extends Component {
    state = {
        ...INITIAL_STATE
    }

    setStateAsync = state =>
        new Promise(resolve => this.setState(state, resolve));

    async componentDidMount() {
        this.setStateAsync({
            users: await db.onceGetUsers().then(snapshot => snapshot.val()),
            booking: await db.onceGetBooking().then(snapshot => snapshot.val()),
        });

        Object.keys(events).map(key => db.doAddListenerToRef(db.usersRef, events[key], this.onSetUsers));
        Object.keys(events).map(key => db.doAddListenerToRef(db.bookingRef, events[key], this.onSetBooking));
    }

    onSetUsers = data => this.setState({ users: data });

    onSetBooking = data => this.setState({ booking: data });

    render() {
        const { users, booking, currentPage, usersPerPage } = this.state;
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        const currentUsers =  Object.entries(users).slice(indexOfFirstUser, indexOfLastUser); 
        
        const renderUsers = currentUsers.map(entry => {
            return (
                <React.Fragment key={entry[0]}>
                    <tr key={entry[0]}>
                        <td><img src={entry[1].avatar} alt={entry[1].username} /></td>
                        <td>{entry[1].username}</td>
                        <td>{entry[1].email}</td>
                        <td>{entry[1].phone || 'Нет телефона'}</td>
                        <td>{this.getCourses(entry[0], booking)}</td>
                        <td>
                            <span 
                                onClick={this.handleEditUserClick.bind(null, entry[0])} 
                                className="userlist__edit">
                                Редактировать
                            </span>
                        </td>  
                    </tr>
                    {this.state.showEditPanel === entry[0] && 
                        <tr>
                            <td colSpan="6">
                                <EditUserPanel uid={entry[0]} booking={booking} onSubmit={this.handleEditSubmit} />
                            </td>
                        </tr>
                    }
                </React.Fragment>
            )}
        );

        return (
            <div>
                <AdminNavigation />
                <table id="userlist">
                    <caption>Зарегистрированные пользователи</caption>
                    <tbody>
                        <tr>
                            <th>Фото</th><th>ФИО</th><th>Email</th><th>Телефон</th><th>Курсы</th><th>Редактировать</th>
                        </tr>
                        {renderUsers}
                    </tbody>
                </table>
                
                <Paginator 
                    items={users} 
                    itemsPerPage={usersPerPage} 
                    onClick={this.handlePageClick} 
                    currentPageClassName="paginator__current-page" 
                />
            </div>
        )
    }

    handleEditUserClick = key => 
        this.state.showEditPanel === key 
        ? this.setState({ showEditPanel: '' }) 
        : this.setState({ showEditPanel: key })

    handlePageClick = page => this.setState({ currentPage: page });

    handleEditSubmit = () => this.setState({ showEditPanel: '' });

    getCourses = (uid, booking) => {
        const courses = [];

        Object.keys(booking).map(key => {
            if(key.includes(uid)){
                courses.push(key)
            }
        });

        if(courses.length === 0) return 'Нет бронирования';

        return (
            <ul className="userlist__courses">  
                {courses.map(key => {
                    const courseId = key.slice(0, key.indexOf('_'));
                    const name = db.doGetCourseInfo(courseId, 'name');
                    return (
                        <li key={courseId}>
                            <Async promise={name} then={(val) => <span>{val}</span>}/>
                        </li>
                    )}
                )}
            </ul> 
        )
    }
}

export default withAdminRole(UsersEdit);