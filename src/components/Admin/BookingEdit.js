import React, { Component } from 'react';
import withAdminRole from '../withAdminRole';
import Async from 'react-promise';
import { db } from '../../firebase';
import { AdminNavigation } from './';
import Paginator from '../Paginator';
import * as events from '../../constants/events';
import { dateOptions } from '../../utils';

const INITIAL_STATE = {
    booking: {},
    currentPage: 1,
    bookingPerPage: 15,
};

class BookingEdit extends Component {

    state = {
        ...INITIAL_STATE
    };

    setStateAsync = state =>
        new Promise(resolve => this.setState(state, resolve));

    async componentDidMount() {
        Object.keys(events).map(key => db.doAddListenerToRef(db.bookingRef, events[key], this.onSetBooking));
    }

    onSetBooking = data => this.setState({ booking: data });

    render() {
        const { booking, currentPage, bookingPerPage } = this.state;
        const indexOfLastBooking = currentPage * bookingPerPage;
        const indexOfFirstBooking = indexOfLastBooking - bookingPerPage;
        const currentBooking =  Object.keys(booking).slice(indexOfFirstBooking, indexOfLastBooking);

        return (
            <div>
                <AdminNavigation />
                <table id="bookinglist">
                    <caption>Последние бронирования</caption>
                    <tbody>
                        <tr>
                            <th>Название курса</th><th>Участник</th><th>Дата бронирования</th><th>Статус оплаты</th><th>Редактировать</th>
                        </tr>
                        {this.renderBooking(currentBooking, booking)}
                    </tbody>
                </table>
                
                <Paginator 
                    items={booking} 
                    itemsPerPage={bookingPerPage} 
                    onClick={this.handlePageClick} 
                    currentPageClassName="paginator__current-page" 
                />
            </div>
        )
    }

    handlePageClick = page => this.setState({ currentPage: page });

    renderBooking = (currentBooking, booking) => currentBooking.map(key => {
        const courseId = key.slice(0, key.indexOf('_')); 
        const uid = key.slice(key.indexOf('_') + 1);
        const courseName = db.doGetCourseInfo(courseId, 'name');
        const username = db.doGetUserInfo(uid, 'username');

        return (
            <React.Fragment key={key}>
                <tr key={key}>
                    {<Async promise={courseName} then={val => <td>{val}</td> }/> }
                    {<Async promise={username} then={val => <td>{val}</td> }/> }
                    <td>{new Date(booking[key].date).toLocaleString('ru', dateOptions)}</td>
                    <td>
                        {booking[key].paid ? 'Оплачено' : 'Не оплачено' }
                    </td>
                    <td>
                        <button type="submit" onClick={this.handlePaymentClick.bind(null, key, booking[key].paid)}>
                            {booking[key].paid ? 'Отменить оплату' : 'Оплатить'}
                        </button>
                        <button type="submit" onClick={db.doRemoveBooking.bind(null, key)}>
                            Удалить бронь
                        </button>
                    </td> 
                </tr>
                
            </React.Fragment>
        )
    })

    handlePaymentClick = (key, paymentStatus) => {
        db.doUpdateBooking(key, 'paid', !paymentStatus);
    }
    

    handleBookingClick = key => {
        this.state.showEditPanel === key 
        ? this.setState({ showEditPanel: '' }) 
        : this.setState({ showEditPanel: key })
    }

    handleEditSubmit = () => this.setState({ showEditPanel: '' });
}

export default withAdminRole(BookingEdit);