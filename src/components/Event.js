import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../constants/routes';

class Event extends Component {

    componentDidMount() {
        this.event.addEventListener('click', this.handleClick(this.props.id))
    }
    componentWillUnmount() {
        this.event.removeEventListener('click', this.handleClick(this.props.id))
    }

    render() {
        const { event, id } = this.props
        return (
            <div ref={event => this.event = event}>
                <div>
                    <h2>{event.name}</h2>
                    <span>Начало: {event.start} Конец: {event.end}</span>
                    <p>Цена: {event.price}</p>
                    <Link to={`/full/${id}`}>Подробнее</Link>
                    <Link to={`${routes.BOOKING}/${id}`}>Забронировать</Link>
                </div>
            </div>
        )
    }

    handleClick = (id) => (event) => {
        console.log(id)
    }
    
}


export default Event;