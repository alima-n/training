import React from 'react';
import { connect } from 'react-redux'; 
import { db } from '../firebase';


const withAdminRole = (Component) => {
  class WithAdminRole extends React.Component {

        state = {
            authUser: this.props.authUser,
            isAdmin: false,
        }

        setStateAsync = state =>
            new Promise(resolve => this.setState(state, resolve));
        
        async componentDidMount() {
            const { authUser }  = this.props;

            authUser
            ? this.setStateAsync({
                isAdmin: await db.isAdmin(authUser.uid).then(snapshot => snapshot.val())
            })
            : this.setState(() => ({ isAdmin: false })); 
            
        }

        render() {
            return this.state.isAdmin ? <Component {...this.props} /> : <p>Страница доступна только администратору</p>;
        }
    }

    const mapStateToProps = (state) => ({
        authUser: state.sessionState.authUser,
    });
    
    return connect(mapStateToProps)(WithAdminRole);
}

export default withAdminRole;