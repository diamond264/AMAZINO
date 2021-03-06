import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import {isSignIn, getItemFromID, getImageByID, getUserDataFromID, getPercentPurchased, createBet, 
    removeItem, getBetsOfItem, doRaffle, addNotification} from '../../shared/Firebase';
import {handleError, handleSuccess, handleSuccessMessage} from '../../shared/ErrorHandling';
import {getLabel} from '../../shared/Helpers';

import ProgressBar from '../../shared/ProgressBar';

import '../../App.css';

class Listing extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            itemID: this.props.match.params.id,
            winner: null,
            seller: null,
            item: null,
            createdOn: null,
            dueDate: null,
            sellerPercent: null,
            maxPercent: 0.5,
            betPercent: 0,
            betPrice: 0,
            percentPurchased: null,
            percentUserPurchased: null,
            betPosted: false,
            itemDeleted: false,
            payedThisSession: 0
        }

    }

    componentDidMount = () => {
        if(isSignIn()) {
            this.getData();
        }
    }

    handleBetSlider = (e) => {
        var betPercent = parseInt(e.target.value, 10) / 100;
        var betPrice = this.state.item.price * betPercent;
        // round to two decimal places
        betPrice = Math.round(betPrice * 100) / 100;

        this.setState({
            betPercent,
            betPrice
        })
    }

    handleBet = (e) => {
        e.preventDefault();
        if(this.state.betPrice === 0) {
            handleError({message: "Please enter a bet"})
        } else {
            this.postBet();
        }
    }

    handleRefund = (e) => {
        e.preventDefault();

        this.getData().then(() => {
            if(this.state.item.status === "waitForBet") {
                this.refundBet(this.state.payedThisSession);
            } else {
                handleError({message: "Item not waiting for bets"});
            }
        })

        
    }

    handleDelete = (e) => {
        e.preventDefault();

        this.deleteItem();
    }

    handleRaffle = (e) => {
        e.preventDefault();

        this.raffleItem();
    }

    // Determine max percent user can bet based on items in state
    setMaxPercent = (e) => {
        var percentCap = .5;
        var maxPercent = .5;
        if(this.state.percentPurchased > percentCap) {
            maxPercent = 1-this.state.percentPurchased;
        }
        if(percentCap - this.state.percentUserPurchased < maxPercent) {
            maxPercent = percentCap - this.state.percentUserPurchased;
        }
        this.setState({
            maxPercent: Math.round(maxPercent * 100) / 100
        });

    }

    //
    // Raffle item and notify winner
    //
    async raffleItem() {
        await doRaffle(this.state.itemID).then( winner => {
            console.log("Raffle complete, winner:" + winner);
            getUserDataFromID(winner).then(user => {
                addNotification(winner, "Congrats " + user.displayName + ", you won!", 
                "Congratulations, you won the item: " + this.state.item.name + 
                ". The seller should be in contact with you shortly. Click this notification to view!", "/listing/"+this.state.itemID);

                addNotification(this.props.currentUser.uid, "You sold an item!", 
                "Great work, you sold the item: " + this.state.item.name + 
                "! Your balance has been updated. Click this notifications to view.", "/listing/"+this.state.itemID);
                
                this.getData();

                handleSuccessMessage("Raffle winner: " + user.displayName);

            })
            
        }).catch(err => {
            handleError(err);
        })
    }

    //
    // Get necessary data for about item and user for listing page
    //
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
                        getUserDataFromID(item.seller).then(seller => {
                            this.setState({
                                seller
                            })
                        }).then(() => {
                            if(item.winner) {
                                getUserDataFromID(item.winner).then(winner => {
                                    this.setState({
                                        winner
                                    })
                                }).catch(err => {
                                    handleError(err);
                                })
                            }
                        }).catch(err => {
                            handleError(err);
                        })

                        if(this.props.currentUser) {
                            this.getPercentPurchased();
                        }
                    }
                });
            
    }

    //
    // Get percent of item already purchased, and percent user has purchased
    //
    async getPercentPurchased() {
        try {
            await getPercentPurchased(this.state.itemID).then(percentPurchased => {
                var percentUserPurchased = 0;

                getBetsOfItem(this.state.itemID).then(bets => {
                    if(bets) {
                        if(bets[this.props.currentUser.uid]) {
                            // do calculation for percent of total price user purchased
                            percentUserPurchased = Math.round(100 * (bets[this.props.currentUser.uid].payment / this.state.item.price)) / 100;
                        }
                    }
                }).then(() => {
                    // update state
                    this.setState({
                        percentPurchased,
                        percentUserPurchased
                    });
                    this.setMaxPercent();
                }).catch(err => {
                    handleError(err);
                })

                
            })
        } catch (err) {
            handleError(err);
        }
    }

    //
    // Posts bet with current values in state
    //
    async postBet() {
        try {
            await createBet(this.state.itemID, this.props.currentUser.uid, this.state.betPrice)
                .then((betData) => {
                    if(betData){
                        console.log(betData);
                        this.getPercentPurchased();
                        handleSuccess();
                        this.setState({
                            betPosted: true,
                            payedThisSession: this.state.betPrice,
                            betPercent: 0,
                            betPrice: 0
                        })
                        this.getData();
                        // reset bet slider
                        document.getElementById('betPercent').value = 0;
                    }
                })
                .catch((err) => {
                    handleError(err)
                });


        } catch(err) {
            handleError(err);
        }
    }

    // load image and update img html element
    async loadImage() {
        try {
            await getImageByID(this.state.itemID)
                .then(url => {
                    var img = document.getElementById('item-image');
                    if(img) {
                        img.src = url;
                    }
                });
        } catch(err) {
            handleError({message: "Image not found"});
        }
    }

    // Refund bet to this user
    async refundBet(amount) {
        try {
            await createBet(this.state.itemID, this.props.currentUser.uid, -amount)
                .then((betData) => {
                    handleSuccess();
                    this.getPercentPurchased();
                    this.setState({
                        betPosted: false,
                        payedThisSession: 0
                    })
                })
                .catch((err) => {
                    handleError(err);
                    console.log(err);
                })
        } catch(err) {
            handleError(err);
            console.log(err);
        }
    }

    // Delete this listing, update state accordingly
    async deleteItem() {
        try {
            await removeItem(this.state.itemID)
            .then(() => {
                handleSuccess();
                this.setState({
                    itemDeleted: true
                });
            })
            .catch(err => {
                console.log(err);
                handleError(err);
            }); 
        } catch(err) {
            console.log(err);
            handleError(err);
        }
    }

    render() {
        if(!this.props.currentUser) return <Redirect to="/signin" />
        if(this.state.itemDeleted) return <Redirect to="/" />
        if(!this.state.item) return <div></div>

        // adjust percentage map for progress bar
        var percentMap = this.state.item.status !== "SoldOut" ? (
            [this.state.percentPurchased-this.state.percentUserPurchased, this.state.percentUserPurchased, this.state.betPercent]
        ) : (
            [1, 0]
        )
        
        var refundLink = this.state.betPosted ? <button className="btn red white-text" style={{marginLeft: "5px"}} onClick={this.handleRefund}>refund</button> : null
        
        // Delete link, only displayed when currentUser is seller
        var raffleLink = this.state.item.status === "readyToRaffle" ? (
            <div className="col s12">
                <button className="btn green white-text" onClick={this.handleRaffle}>raffle</button>
                <div className="section"></div> 
            </div>
        ) : null

        var sellerLinks = this.state.item.status !== "SoldOut" && this.state.item.seller === this.props.currentUser.uid ? (
            <div className="row center">
                {raffleLink}
                <div className="col s12">
                    <button className="btn red white-text" onClick={this.handleDelete}>delete</button>
                </div>
            </div>
        ) : null

        var betLabel = getLabel(this.state.item.status);

        // From for betting, only displayed if current user is not seller
        var betForm = this.state.item.status === "waitForBet" && this.state.item.seller !== this.props.currentUser.uid ? (
            <div>
                <div className="row center">
                    <div className="col s8 m6 l4 offset-s2 offset-m3 offset-l4">
                        <p>Current bet: {this.state.betPercent * 100}%</p>
                        <p className="grey-text text-darken-1">Price: ${this.state.betPrice.toFixed(2)}</p>
                        <p className="range-field"><input onChange={this.handleBetSlider} step="5" defaultValue={this.state.betPercent} type="range" id="betPercent" min="0" max={this.state.maxPercent * 100}/></p>
                        <label>Max bet: {this.state.maxPercent * 100}%</label>
                    </div>
                </div>
                <div className="row center">
                    <div className="col s12">
                        <button className="btn green white-text" onClick={this.handleBet}>bet</button>
                        {refundLink}    
                    </div>
                </div>
            </div>
        ) : null

        //var sellerDisplayName = this.getSellerInfo().displayName;

        /**
         * Information to be displayed to the winner of the item
         */
        var winnerInfo = this.state.seller && this.props.currentUser.uid === this.state.item.winner ? (
            <div className="row center">
                <div className="col s12">
                    <h4>Congratulations!</h4>
                    <p>You've won this item from {this.state.seller.displayName}, and you should be contacted by them shortly.</p>
                </div>
                <div className="col s12">
                    <div className="section"></div>
                    <h6>Seller's contact info</h6>
                    <p>Email: {this.state.seller.email}</p>
                </div>
            </div>
        ) : null

        /**
         * Info to be displayed to the seller after item has been won
         */
        var sellerInfo = this.state.winner && this.props.currentUser.uid === this.state.item.seller ? (
            <div className="row center">
                <div className="col s12">
                    <h4>You sold your item!</h4>
                    <p>Congratulations! Please contact the winner, {this.state.winner.displayName}, to arrange shipping of your item.</p>
                </div>
                <div className="col s12">
                    <div className="section"></div>
                    <h6>Winner's contact info</h6>
                    <p>Email: {this.state.winner.email}</p>
                </div>
            </div>
        ) : null

        var displayName = this.state.seller ? this.state.seller.displayName : null

        return(
            <div className="container section">
            <div className="card col s8 m4">
                <div className="card-content">
                    <h5>{this.state.item.name}</h5>
                    <p className="grey-text text-darken-1">Price: ${this.state.item.price}</p>
                    <label>Category: {this.state.item.category}</label>

                    <div className="row center">
                        <img id="item-image" className="item-image" alt="item" />
                    </div>

                    <p className="section">{this.state.item.description}</p>

                    <div className="divider"></div>
                    <div className="section"></div>

                    <div className="row">
                        <ProgressBar label={true} percentMap={percentMap} />
                    </div>

                    {betLabel}

                    {betForm}

                    {sellerLinks}

                    {winnerInfo}

                    {sellerInfo}

                    <div className="section row">
                        <div className="divider"></div>
                        <div className="col s6 left">
                            <p className="grey-text">by {displayName} on {this.state.createdOn.getMonth()+1}/{this.state.createdOn.getDate()}/{this.state.createdOn.getFullYear()}</p>
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