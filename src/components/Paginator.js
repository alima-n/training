import React, { Component } from 'react';

class Paginator extends Component {
    state = {
        currentPage: 1,
    }

    render() {
        const { items, itemsPerPage, currentPageClassName } = this.props;
        const { currentPage } = this.state;
        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(Object.keys(items).length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }
  
        return (
            <ul className="paginator">
                {pageNumbers.map(number => 
                    <li 
                        key={number} 
                        className={currentPage === number ? currentPageClassName : null} 
                        id={number} 
                        onClick={this.handleClick.bind(null, number)}
                    > 
                        {number} 
                    </li>
                )}
            </ul>
        )
    }

    handleClick = (number, event) => {
        this.props.onClick(number);

        this.setState({
            currentPage: number
        })
    }
}

export default Paginator;