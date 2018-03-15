// state = {
//     showEditor: false,
// }
// const editorBtnText = this.state.showEditor ? 'Закрыть редактор' : 'Открыть редактор';

// <input type="email" onChange={this.onChange} placeholder="Найти пользователю по емейлу" /> 

// <button type="submit" onClick={() => this.setState({ showEditor: !this.state.showEditor })}>{editorBtnText}</button> 
// {this.state.showEditor ? <CreateNewEvent /> : null}

import React, { Component } from 'react';
import withAdminRole from '../withAdminRole';
import CreateNewCourse from './CreateNewCourse';
import { AdminNavigation } from './';

class CoursesEdit extends Component {

    componentDidMount() {

    }

    render() {
        return (
            <div>
                 <AdminNavigation />
                 <CreateNewCourse />
                Курсы
            </div>
        )
    }
}

export default withAdminRole(CoursesEdit);