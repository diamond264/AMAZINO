import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import Listings from '../market/Listings';
//import {getAllItems, createBet, removeItem, doRaffle} from '../../shared/Firebase.js';
import {getItemsBySeller, getUserDataFromID, updateUserNotiItem} from "../../shared/Firebase";

//
// Wrapper component for listings
//

class UserListings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            user: null
        }
    }

    //Grabs data on start up to get the summary of an item
    componentDidMount = () => {
        this.getUserData();
        this.getData();
        if(this.props.currentUser) {
            updateUserNotiItem(this.props.currentUser.uid);
        }
    }

    //Sets the currently logged in user as "User"
    async getUserData() {
        if(this.state.currentUser) {
            await getUserDataFromID(this.state.currentUser.uid).then(user => {
                this.setState({
                    user
                })
            });
        }
    }

    //Grabs "User's" items based on unique UserID
    async getData() {
        if(this.state.currentUser) {
            await getItemsBySeller(this.state.currentUser.uid, 100, 1)
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

    //Renders the listing summaries
    render() {
        if(!this.props.currentUser) return <Redirect to="/"/>
        return(
            <div className="container section">
                <div className="card z-depth-1">
                    <div className="card-content">
                        <div className="section center">
                            <h4>My Listings</h4>
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

export default UserListings;