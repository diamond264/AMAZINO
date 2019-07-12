import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import {isSignIn, getItemFromID, getImageByID, getUserDataFromID, getPercentPurchased, createBet} from '../../shared/Firebase.js';
import {handleError, handleSuccess} from '../../shared/ErrorHandling.js';

import '../../App.css';

class Listing extends Component {
    constructor(props) {
        super(props);

        //
        // TODO: Set maxPercent from database
        //

        var {currentUser} = this.props;
        console.log(props);
        this.state = {
            itemID: this.props.match.params.id,
            currentUser,
            item: null,
            createdOn: null,
            dueDate: null,
            sellerPercent: null,
            maxPercent: 0.5,
            betPercent: 0,
            betPrice: 0,
            displayName: null,
            percentPurchased: null,
            betPlaced: false
        }
    }

    componentDidMount = () => {
        this.getData();
    }

    handleBetSlider = (e) => {
        var betPercent = parseInt(e.target.value, 10) / 100;
        var betPrice = parseInt(this.state.item.price, 10) * betPercent;
        // round to two decimal places
        betPrice = Math.round(betPrice * 100) / 100;

        this.setState({
            betPercent,
            betPrice
        })
    }

    handleBet = () => {
        if(this.state.betPrice === 0) {
            handleError({message: "Please enter a bet"})
        } else {
            this.postBet();
        }
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
                    this.loadImage();

                    //
                    // Get seller's username data
                    //
                    if(item) {
                        getUserDataFromID(item.seller).then(user => {
                            if(user) {
                                this.setState({
                                    displayName: user.displayName
                                })
                            }
                        })
                        this.getPercentPurchased();
                    }
                });
            
    }

    async getPercentPurchased() {
        try {
            await getPercentPurchased(this.state.itemID).then(percentPurchased => {
                this.setState({
                    percentPurchased
                })
            })
        } catch (err) {
            handleError(err);
        }
    }

    async postBet() {
        try {
            await createBet(this.state.itemID, this.state.currentUser.uid, this.state.betPrice)
                .then((betData) => {
                    if(betData){
                        this.setState({
                            betPlaced: true
                        })
                    }
                })
                .catch((err) => {
                    handleError(err)
                });


        } catch(err) {
            handleError(err);
        }
    }

    async loadImage() {
        await getImageByID(this.state.itemID)
            .then(url => {
                var img = document.getElementById('item-image');
                if(img) {
                    img.src = url;
                }
            });
    }

    render() {
        if(!isSignIn()) return <Redirect to="/signin" />
        if(this.state.betPlaced) return <Redirect to="/"/>
        if(!this.state.item) return <div></div>
        
        return(
            <div className="container">
            <div className="card col s8 m4">
                <div className="card-content">
                    <h5>{this.state.item.name}</h5>
                    <p className="grey-text text-darken-1">Price: ${this.state.item.price}</p>
                    <label>Category: {this.state.item.category}</label>

                    <div className="row center">
                        <img id="item-image" className="item-image" alt="Image"/>
                    </div>

                    <p className="section">{this.state.item.description}</p>

                    <div className="divider"></div>
                    <div className="section"></div>
                    <div className="row center">
                        <div className="col s8 m6 l4 offset-s2 offset-m3 offset-l4">
                            <p>Chance to win: {this.state.betPercent * 100}%</p>
                            <p className="grey-text text-darken-1">Price: ${this.state.betPrice.toFixed(2)}</p>
                            <p className="range-field"><input onChange={this.handleBetSlider} step="5" type="range" id="betPercent" min="0" max={this.state.maxPercent * 100}/></p>
                            <label>Max bet: {this.state.maxPercent * 100}%</label>
                        </div>
                    </div>
                    <div className="row center">
                        <div className="col s6 m4 l2 offset-s3 offset-m4 offset-l5">
                            <button className="btn green white-text" onClick={this.handleBet}>bet</button>
                        </div>
                    </div>

                    <div className="row">
                        <label htmlFor="progressBar">Progress</label>
                        <div className="progress section">
                            <div className="determinate" style={{width: (this.state.percentPurchased * 100) +"%"}}></div>
                        </div>
                    </div>

                    <div className="section row">
                        <div className="divider"></div>
                        <div className="col s6 left">
                            <p className="grey-text">by {this.state.displayName} on {this.state.createdOn.getMonth()+1}/{this.state.createdOn.getDate()}/{this.state.createdOn.getFullYear()}</p>
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