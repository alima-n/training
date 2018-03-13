import React, { Component } from 'react';
import withAdminRole from '../withAdminRole';
import { db } from '../../firebase';
import Async from 'react-promise';

class UsersEdit extends Component {

    componentDidMount() {

    }

    render() {
        const { users } = this.props;

        return (
            <div>
                Юзеры
                {this.getBody(users)}
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
                </li>   
            )}
        </ul>

    getCourses =  (courses) => 
        <ul>
            {Object.keys(courses).map((key) => {
                let name = db.doGetCourseInfo(key, 'name');
                return (<li key={key}>
                    <Async promise={name} then={(val) => <span>{val}</span>}/>
                </li>)
            }
            )}
        </ul>
    
}

export default withAdminRole(UsersEdit);