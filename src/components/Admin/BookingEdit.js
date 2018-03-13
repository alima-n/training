import React, { Component } from 'react';
import withAdminRole from '../withAdminRole';

class BookingEdit extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <div>
                Последние бронирования
            </div>
        )
    }
}

export default withAdminRole(BookingEdit);