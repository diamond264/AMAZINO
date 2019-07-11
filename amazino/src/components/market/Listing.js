import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import {isSignIn, getItemFromID} from '../../shared/Firebase.js';

class Listing extends Component {
    constructor(props) {
        super(props);

        //
        // TODO: Set maxPercent from database
        //
        this.state = {
            itemID: this.props.match.params.id,
            item: null,
            createdOn: null,
            dueDate: null,
            sellerPercent: null,
            maxPercent: 0.5,
            betPercent: 0
        }
        console.log(this.state.itemID);
    }

    componentWillMount = () => {
        this.getData();
    }

    handleBetSlider = (e) => {
        var betPercent = e.target.value / 100;
        this.setState({
            betPercent
        })
    }

    handleBet = () => {
        console.log(this.state.betPercent);
    }

    
    async getData() {
            await getItemFromID(this.state.itemID)
                .then(item => {
                    var createdOn = new Date(item.postDate);
                    var dueDate = new Date(item.dueDate);
                    this.setState({
                        item,
                        createdOn,
                        dueDate
                    })
                    console.log(item);
                })
    }

    render() {
        if(!isSignIn()) return <Redirect to='/signin' />
        if(!this.state.item) return <div></div>
        return(
            <div className="container">
            <div className="card col s8 m4">
                <div className="card-content">
                    <h5>{this.state.item.name}</h5>
                    <p className="grey-text text-darken-1">Price: ${this.state.item.price}</p>
                    <p className="section">{this.state.item.description}</p>
                    <div className="divider"></div>
                    <div className="section"></div>
                    <div className="row">
                        <div className="col s6 m5 l4">
                            <p>Chance to win: {this.state.betPercent * 100}%</p>
                            <p className="range-field"><input onChange={this.handleBetSlider} step="5" type="range" id="betPercent" min="0" max={this.state.maxPercent * 100}/></p>
                            <label>Max bet: {this.state.maxPercent * 100}%</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s4 m3 l2">
                            <button className="btn" onClick={this.handleBet}>bet</button>
                        </div>
                    </div>
                    <div className="section row">
                        <div className="divider"></div>
                        <div className="col s6 left">
                            <p className="grey-text">by {this.state.item.seller} on {this.state.createdOn.getMonth()+1}/{this.state.createdOn.getDate()}/{this.state.createdOn.getFullYear()}</p>
                        </div>
                        <div className="col s6 right">
                            <p className="right grey-text">ends on {this.state.dueDate.getMonth()+1}/{this.state.dueDate.getDate()}/{this.state.dueDate.getFullYear()}</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
        }
}

export default Listing;