import React, { Component } from 'react';
import { db } from '../../firebase';
import Async from 'react-promise';

const INITIAL_STATE = {
    avatar: '',
    username: '',
    email: '',
    phone: '',
    error: null,
}

const coursesToRemove = [];

class EditPanel extends Component {

    state = {
        ...INITIAL_STATE
    }

    render() {
        const { user: {courses} } = this.props;
        const { error }= this.state;

        return (
            <div className={this.props.className}>
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
                    {courses ? this.getCourses(courses) : null}
                    <button type="submit">Сохранить изменения</button>
                </form>
                {error && error.message}
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

    handleCheckboxClick = (event) => {
        const id = event.target.id;
        
        if(event.target.checked && !coursesToRemove.find(x => x === id)) {
            coursesToRemove.push(id);
        } else {
            coursesToRemove.splice(coursesToRemove.indexOf(id), 1);
        }        
    }

    getCourses = (courses) => 
        <div> Удалить бронь
            {Object.keys(courses).map(key => {
                const name = db.doGetCourseInfo(key, 'name');
                return (
                    <div key={key}>
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

        
    onSubmit = event => {
        event.preventDefault();
        const { avatar, username, email, phone,  } = this.state;
        const { uid } = this.props;

        if(avatar) db.doUpdateAvatar(uid, avatar);
        if(username) db.doUpdateUserInfo(uid, 'username', username);
        if(email) db.doUpdateUserInfo(uid, 'email', email);
        if(phone) db.doUpdateUserInfo(uid, 'phone', phone);
        if(coursesToRemove) db.doRemoveBooking(uid, coursesToRemove);

        this.props.onSubmit();
    }
}

export default EditPanel;