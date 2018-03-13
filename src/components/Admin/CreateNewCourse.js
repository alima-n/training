import React, { Component } from 'react';
import { db } from '../../firebase';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './style.css';

const INITIAL_STATE = {
    isAdmin: null,
    editorState: EditorState.createEmpty(),
    name: '',
    type: '',
    start: '',
    end: '',
    price: 0,
    modules: 0,
    error: null
}

class CreateNewCourse extends Component {

    state = { ...INITIAL_STATE }

    render() {
        const { editorState, name, type, start, end, price, modules, error } = this.state

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    value={name}
                    onChange={event => this.setState(this.getValueByProp('name', event.target.value))}
                    type="text"
                    placeholder="Название мероприятия"
                />
                <select value={type} onChange={event => this.setState(this.getValueByProp('type', event.target.value))} >
                    <option value="business">Бизнес-тренинг</option>
                    <option value="pro">Курсы по психологии</option>
                    <option value="master">Мастер-класс</option>
                </select>
                <input
                    value={start}
                    onChange={event => this.setState(this.getValueByProp('start', event.target.value))}
                    type="text"
                    placeholder="Начало"
                />
                <input
                    value={end}
                    onChange={event => this.setState(this.getValueByProp('end', event.target.value))}
                    type="text"
                    placeholder="Конец"
                />
                <label htmlFor="price"> Стоимость </label>
                    <input
                        id="price"
                        value={price}
                        onChange={event => this.setState(this.getValueByProp('price', event.target.value))}
                        type="number"
                    />
                <label htmlFor="modules"> Количество модулей </label>
                <input
                    id="modules"
                    value={modules}
                    onChange={event => this.setState(this.getValueByProp('modules', event.target.value))}
                    type="number"
                    placeholder="Количество модулей"
                />
                <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={this.onEditorStateChange}
                />

                <button type="submit">Отправить</button>

                { error && <p>{error.message}</p> }
            </form>
        )
                
    }

    onEditorStateChange: Function = (editorState) => {
        this.setState({
          editorState,
        });
    };

    onSubmit = (event) => {
        event.preventDefault();

        const { name, type, start, end, price, modules, editorState} = this.state

        const contentState = editorState.getCurrentContent() 

        const contentAsHTML = stateToHTML(contentState)

        db.doCreateEvent(name, type, start, end, price, modules, contentAsHTML) 

        this.setState({ ...INITIAL_STATE })

    }

    getValueByProp = (propertyName, value) => () => ({
        [propertyName]: value,
    })
}

export default CreateNewCourse;