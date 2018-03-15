import React, { Component } from 'react';
import { db } from '../../firebase';
import Async from 'react-promise';

const INITIAL_STATE = {
    avatar: '',
    username: '',
    email: '',
    phone: '',
}

const coursesToRemove = [];

class EditUserPanel extends Component {

    state = {
        ...INITIAL_STATE
    }

    render() {
        const { uid, booking } = this.props;

        return (
            <div className="userlist__edit-panel">
                <form onSubmit={this.onSubmit}>
                    <label>Изменить фото профиля
                        <input type="file" onChange={this.handleFileChange} />
                    </label>
                    <label>Изменить ФИО
                        <input type="text" onChange={this.handleTextChange.bind(null, 'username')} placeholder="Новое имя" />
                    </label>
                    <label>Изменить Email
                        <input type="email" onChange={this.handleTextChange.bind(null, 'email')} placeholder="Новый email" />
                    </label>
                    <label>Изменить номер телефона
                        <input type="tel" onChange={this.handleTextChange.bind(null, 'phone')} placeholder="Новый телефон" />
                    </label>
                    {this.getCourses(uid, booking)}
                    <button type="submit">Сохранить изменения</button>
                </form>
                <button type="submit" onClick={db.doRemoveUser.bind(null, uid)} className="userlist__remove-user-btn">Удалить пользователя</button>
            </div>
        )
    }

    handleFileChange = event => {
        const { files } = event.target;
        files.length > 0 ? this.setState({ avatar: files[0] }) : this.setState({ avatar: '' });
    }

    handleTextChange = (field, event) => {
        const { value } = event.target;
        this.setState({ [field]: value});
    }

    handleCheckboxClick = event => {
        const id = event.target.id;
        
        if(event.target.checked && !coursesToRemove.find(x => x === id)) {
            coursesToRemove.push(id);
        } else {
            coursesToRemove.splice(coursesToRemove.indexOf(id), 1);
        }      

    }

    getCourses = (uid, booking) => {
        const courses = [];

        Object.keys(booking).map(key => {
            if(key.includes(uid)){
                courses.push(key)
            }
        });

        if(courses.length === 0) return 'Нет бронирования';

        return (
            <div> Удалить бронь
                {courses.map(key => {
                    const courseId = key.slice(0, key.indexOf('_'));
                    const name = db.doGetCourseInfo(courseId, 'name');
                    console.log(key, courseId)
                    return (
                        <div key={courseId}>
                            <Async promise={name} then={(val) => 
                                <label htmlFor={key}> 
                                    {val}
                                    <input type="checkbox" id={key} onClick={this.handleCheckboxClick} />
                                </label>}
                            />
                        </div>
                    )}
                )}
            </div>
        )
    }
        
    onSubmit = event => {
        event.preventDefault();
        const { avatar, username, email, phone,  } = this.state;
        const { uid } = this.props;

        if(avatar) db.doUpdateAvatar(uid, avatar);
        if(username) db.doUpdateUserInfo(uid, 'username', username);
        if(email) db.doUpdateUserInfo(uid, 'email', email);
        if(phone) db.doUpdateUserInfo(uid, 'phone', phone);
        if(coursesToRemove) db.doRemoveBooking(coursesToRemove);

        this.props.onSubmit();
    }
}

export default EditUserPanel;