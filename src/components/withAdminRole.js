import React from 'react';
import PropTypes from 'prop-types';
import { db } from '../firebase';

const withAdminRole = (Component) => {
  class WithAdminRole extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                isAdmin: false,
            };
        }

        getChildContext() {
            return {
              isAdmin: this.state.isAdmin,
            };
        }

        setStateAsync = state =>
            new Promise(resolve => this.setState(state, resolve));
        
        async componentDidMount() {
            const { authUser }  = this.context;
            this.context.authUser
            ? this.setStateAsync({
                isAdmin: await db.isAdmin(authUser.uid).then(snapshot => snapshot.val())
            })
            : this.setState(() => ({ isAdmin: false }));          
        }

        render() {
            return this.state.isAdmin ? <Component {...this.props} /> : <p>Страница доступна только администратору</p>;
        }
    }

    WithAdminRole.contextTypes = {
        authUser: PropTypes.object,
    };

    WithAdminRole.childContextTypes = {
        isAdmin: PropTypes.bool
    };
    
    return WithAdminRole;
}

export default withAdminRole;