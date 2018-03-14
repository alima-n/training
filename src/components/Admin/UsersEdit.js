import React, { Component } from 'react';
import Async from 'react-promise';
import withAdminRole from '../withAdminRole';
import { db } from '../../firebase';
import EditPanel from './EditPanel';
import Paginator from '../Paginator';
import * as events from '../../constants/events';
import { dateOptions } from '../../utils';
import './style.css';

const INITIAL_STATE = {
    users: {},
    currentPage: 1,
    usersPerPage: 5,
    showEditPanel: '',
}

class UsersEdit extends Component {
    state = {
        ...INITIAL_STATE
    }

    setStateAsync = state =>
        new Promise(resolve => this.setState(state, resolve))
    
    onSetUsers = (data) => {
        this.setState({ users: data })
    }

    async componentDidMount() {
        this.setStateAsync({
			users: await db.onceGetUsers().then(snapshot => snapshot.val())
        });

        Object.keys(events).map(key => db.doAddListenerToRef(db.usersRef, events[key], this.onSetUsers));
    }

    componentWillUnmount() {
        this.setState({ ...INITIAL_STATE });
    }

    render() {
        const { users, currentPage, usersPerPage } = this.state;
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
                        <td>{entry[1].courses ? this.getCourses(entry[1].courses) : 'Нет бронирования'}</td>
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
                                <EditPanel uid={entry[0]} user={entry[1]} onSubmit={this.handleEditSubmit} className="userlist__edit-panel" />
                            </td>
                        </tr>
                    }
                </React.Fragment>
            )}
        );

        return (
            <div>
                <table id="userlist">
                    <caption>Зарегистрированные пользователи</caption>
                    <tbody>
                        <tr>
                            <th>Фото</th>
                            <th>ФИО</th>
                            <th>Email</th>
                            <th>Телефон</th>
                            <th>Курсы</th>
                            <th>Редактировать</th>
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

    handleEditUserClick = (key) => {
        if(this.state.showEditPanel === key) {
            this.setState({ showEditPanel: '' })
        } else {
            this.setState({ showEditPanel: key })
        }
        
    }

    handlePageClick = (page) => {
        this.setState({
          currentPage: page
        });
    }

    handleEditSubmit = () => {
        this.setState({ showEditPanel: '' })
    }

    getCourses = (courses) => 
        <ul className="userlist__courses">
            
            {Object.keys(courses).map(key => {
                const name = db.doGetCourseInfo(key, 'name');
                return (
                    <li key={key}>
                        <Async promise={name} then={(val) => <span>{val}</span>}/>
                        <span>Забронировано {new Date(courses[key]).toLocaleString('ru', dateOptions)}</span>
                    </li>
                )}
            )}
        </ul> 
}


export default withAdminRole(UsersEdit);