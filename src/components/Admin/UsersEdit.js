import React, { Component } from 'react';
import withAdminRole from '../withAdminRole';
import { db } from '../../firebase';
import Async from 'react-promise';

import './style.css';

class UsersEdit extends Component {

    state = {
        users: null,
        showEditPanel: '',
    }

    render() {
        const users = db.onceGetUsers();

        return (
            <div>
                Юзеры
                <Async promise={users} then={(val) => <span>{this.getBody(val)}</span>}/>
            </div>
        )
    }

    getBody = (users) => 
        <ul>
            {Object.keys(users).map((key) =>
                <li key={key}>
                    <div><img src={users[key].avatar} alt={users[key].username} />{users[key].username}</div>
                    <div>{users[key].email}</div>
                    <div>{users[key].phone || "Нет номера"}</div>
                    {users[key].courses ? <div>Выбраны курсы: {this.getCourses(users[key].courses)}</div>: <div>Нет забронированных курсов</div> }
                    <button type="submit" onClick={this.handleEditUserClick.bind(null, key)}>Редактировать</button>
                    {this.state.showEditPanel === key && <EditPanel user={users[key]}/>}
                </li>  
            )}
        </ul>

    getCourses =  (courses) => 
        <ul>
            {Object.keys(courses).map((key) => {
                const name = db.doGetCourseInfo(key, 'name');
                return (<li key={key}>
                    <Async promise={name} then={(val) => <span>{val}</span>}/>
                </li>)
            }
            )}
        </ul>
    
    handleEditUserClick = (key) => {
        this.setState({ showEditPanel: key })
    }
    
}

const EditPanel = () => {
    return <div className="edit_popup">РЕДАКТИРОВАТЬ</div>
}

export default withAdminRole(UsersEdit);