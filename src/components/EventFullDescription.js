import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Link } from 'react-router-dom';
import * as routes from '../constants/routes';

class EventFullDescription extends Component {

    render() {
        const { courses, courseId } = this.props

        return (
            <div>
                <h2>Полное описание курса</h2>
                {this.getBody(courses, courseId)}
                <Link to={`${routes.BOOKING}/${courseId}`}>Забронировать</Link>
            </div>
        )
    }

    getBody = (courses, id) => {
        // eslint-disable-next-line
        return Object.keys(courses).map(key => {
            if (key === id) return ReactHtmlParser(courses[key].description)
        })
    }
    
}


export default EventFullDescription;