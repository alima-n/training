import React, { Component }from 'react';
import PropTypes from 'prop-types';
import { db } from '../firebase';
import { getValueByProp } from '../utils'

const INITIAL_STATE = {
	username: '',
	email: '',
	phone: '',
    error: null,
    sent: false
};

class SubscribeForm extends Component {

    constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
    }
    
    onSubmit = (event) => {
        event.preventDefault();

        const {
            username,
			email,
			phone,
		} = this.state;

        const { authUser }  = this.context

        db.doAddSubscriber(username, email, phone, authUser.uid)
        
        if(authUser) {
            db.doUpdateUserInfo(authUser.uid, 'subscribed', true)
        }

        this.setState({
            ...INITIAL_STATE,
            sent: true
        })
    }

    render() {
        const {
			username,
			email,
            phone,
            error, 
            sent
        } = this.state;
        
        const isInvalid = email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <h4>Подпишитесь на нашу рассылку и мы обещаем, что вы пожалеете</h4>
                <input
                    value={username}
                    onChange={event => this.setState(getValueByProp('username', event.target.value))}
                    type="text"
                    placeholder="Как к вам обращаться?"
                /> 
                <input
                    value={email}
                    onChange={event => this.setState(getValueByProp('email', event.target.value))}
                    type="email"
                    placeholder="Email*"     
                />
                <input
                    value={phone}
                    onChange={event => this.setState(getValueByProp('phone', event.target.value))}
                    type="tel"
                    placeholder="Номер телефона"
                />
                <button disabled={isInvalid} type="submit">Подписаться</button>
                {sent && <p>Вы благополучно подписались на спам!</p>}
                { error && <p>{error.message}</p> }
			</form>
        )
    }
}

SubscribeForm.contextTypes = {
    authUser: PropTypes.object,
};

  
export default SubscribeForm;