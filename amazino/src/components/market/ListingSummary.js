import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import '../../App.css';

//
// Summarize a listing, to be viewed as a card within the Market
// or in user listing summary
//
class ListingSummary extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {

        return (
            <NavLink to={'/item/' + this.props.id} className="black-text">
                    <div className="card col s6 m6 market-fade z-depth-0">
                        <div className="card-content">
                            <h5>{this.props.title}</h5>
                            <p className="grey-text text-darken-1">Price: ${this.props.price}</p>
                            <p className="truncate">{this.props.description}</p>
                            <div className="section">
                                <div className="divider"></div>
                                <p className="grey-text">by {this.props.displayName} on {this.props.createdOn.getMonth()}/{this.props.createdOn.getDay()}/{this.props.createdOn.getFullYear()}</p>
                            </div>
                        </div>
                    </div>
            </NavLink>
        )
    }
}

export default ListingSummary;