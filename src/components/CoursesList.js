import React, { Component } from 'react';
import Event from './Event';

class CoursesList extends Component {

	render() {
		const { courses, type } = this.props;
		return (
			<div>
				<h3>Ближайшие тренинги</h3>
				{Object.keys(courses).map(key => {
					return courses[key].type === type ? 
						<li key={key}>
							<Event event={courses[key]} id={key}/>
						</li> :
						null
					}
				)}
			</div>
		)
	}

}

export default CoursesList;