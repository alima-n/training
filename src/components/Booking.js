import React, { Component } from 'react';
import { db } from '../firebase';
import { getValueByProp } from '../utils';
import { SignInForm } from './SignIn';
import { SignUpForm } from './SignUp';

class BookingPage extends Component {

    state = {
        courseName: '',
        courseStart: '',
        bookingExists: false,
        userSubscribed: false,
        phone: '000 000 00 00',
        success: false,
        error: null,
    } 

    setStateAsync = state =>
    	new Promise(resolve => this.setState(state, resolve))

	async componentDidMount() {
        const { courseId } = this.props;
        
		this.setStateAsync({
            courseName: await db.doGetCourseInfo(courseId, 'name'),
            courseStart: await db.doGetCourseInfo(courseId, 'start'),
        })
        
        if(this.props.user) {
            const uid = this.props.user.uid;

            this.setStateAsync({
                bookingExists: await db.doCheckIfBookingExists(uid, courseId),
            }) 
        }
	}

    render() {
        const { courseName, courseStart, bookingExists, error, success } = this.state

        if(bookingExists) return <h3>Для этого аккаунта уже забронировано место. Мероприятие начнется {courseStart}. До встречи!</h3> 
  
        return (
            <div>
                <h3>Забронировать место на: {courseName}</h3>
                {this.props.user ? this.formForAuthUser(this.props.user) : this.requestSignIn()}
                {success && <h3>Вы успешно забронировали место. До встречи {courseStart}!</h3>}
                {error && <p>{error.message}</p>}
            </div>
        )
    }
    
    formForAuthUser = (user) => {
        const uid = user.uid;
        const { phone, success } = this.state;
        
        if(success) return null

        return (
            <form onSubmit={this.onSubmit.bind(null, uid, phone)}>
                <p>Пожалуйста, укажите свой номер телефона для связи.</p>
                <input
                    value={phone}
                    onChange={event => this.setState(getValueByProp('phone', event.target.value))}
                    type="tel"
                    placeholder="Номер телефона"
                />
                <button type="submit" disabled={success}>Забронировать</button> 
            </form>
        )
    }

    requestSignIn = () => {
        return (
            <div>
                <p>Чтобы забронировать место на мероприятии, войдите в свой аккаунт</p>
                <SignInForm /> 
                <p>или зарегистрирйтесь, если у вас еще нет аккаунта</p>
                <SignUpForm />
            </div>
        )
        
    }

    onSubmit = (uid, phone, event) => {
        event.preventDefault();
        const { courseId } = this.props;
        db.doUpdateUserInfo(uid, 'phone', this.state.phone);
        db.doUpdateUserInfo(uid, `courses/${courseId}`, +new Date());

        db.doBookCourse(courseId, uid)
        .then(() => this.setState(getValueByProp('success', true)))
        .catch(error => this.setState(getValueByProp('error', error)))
    }

}

export default BookingPage;
