import React, { Component } from 'react';

import { db } from '../firebase';

class HomePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			testimonials: null,
		};
	}

	componentDidMount() {
		db.onceGetTestimonials()
			.then(snapshot =>
			this.setState(() => ({ testimonials: snapshot.val() }))
			);
	}

	render() {
		const { testimonials } = this.state;

		return (
			<div>
				<h1>Наши ближайшие мероприятия</h1>
				<ul>
					<li>Шабаш на Лысой горе (валетная парковка метёлок)</li>
					<li>Крестный ход в ознаменование победы над ведьмами с предыдущего мероприятия</li>
					<li>Дискотека 90-х (генеральный партнер: ДК им. В.И.Ленина)</li>
					<li>Спарринг престидижитатора и гипнотизера</li>
					<li>Курс "Учимся различать съедобные и несъедобные грибы"</li>
				</ul>

				{ !!testimonials && <Testimonials testimonials={testimonials} /> }
			</div>
		);
	}
}

const Testimonials = ({ testimonials }) =>
	<div>
		<h2>Отзывы</h2>

		{Object.keys(testimonials).map(key =>
		<div key={key}>{testimonials[key].text}<strong>{testimonials[key].username}</strong></div>
		)}
	</div>


export default HomePage;