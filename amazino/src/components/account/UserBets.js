import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'

import Listings from '../market/Listings';
//import {getAllItems, createBet, removeItem, doRaffle} from '../../shared/Firebase.js';
import {
    getBetItemsByUser,
    getUserDataFromID,
    updateUserNotiBet
} from "../../shared/Firebase";

//
// Wrapper component for listings
//

class UserBets extends Component {
    //Constructor for the "My Bets Page"
    constructor(props) {
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            user: null,
        }
    }

    //Grabs bets on start up with the two functions below
    componentDidMount = () => {
        this.getUserData();
        this.getData();
        if(this.props.currentUser) {
            updateUserNotiBet(this.props.currentUser.uid);
        }
    }

    //Sets the currently logged in user as "user"
    async getUserData() {
        if(this.state.currentUser) {
            await getUserDataFromID(this.state.currentUser.uid).then(user => {
                this.setState({
                    user
                })
            });
        }
    }

    //Grabs the bets that the "user" has made based on unique UserID
    async getData() {
        if(this.state.currentUser) {
            await getBetItemsByUser(this.state.currentUser.uid)
                .then(items => {
                    if(items) {
                        this.setState({
                            data: items
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
        }
    }

    //Renders the "My Bets" page to display bets
    render() {
        if(!this.props.currentUser) return <Redirect to="/"/>
        return(
            <div className="container section">
                <div className="card z-depth-1">
                    <div className="card-content">
                        <div className="section center">
                            <h4>My Bets</h4>
                        </div>
                        <div className="divider"></div>
                        <div className="row section center">
                            <div className="col s12 card z-depth-0">
                                <div className="section"></div>
                                <div className="card-content">
                                    <Listings data={this.state.data}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserBets;