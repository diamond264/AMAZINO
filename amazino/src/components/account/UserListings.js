import React, {Component} from 'react';

import Listings from '../market/Listings';
//import {getAllItems, createBet, removeItem, doRaffle} from '../../shared/Firebase.js';
import {getItemsBySeller, getItemsByStatus, getUnSoldItems, getUserDataFromID} from "../../shared/Firebase";

//
// Wrapper component for listings
//

class UserListings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            user: null,
        }
    }

    componentDidMount = () => {
        this.getUserData();
        this.getData();
    }

    async getUserData() {
        if(this.state.currentUser) {
            await getUserDataFromID(this.state.currentUser.uid).then(user => {
                this.setState({
                    user
                })
            });
        }
    }

    async getData() {
        if(this.state.currentUser) {
            await getItemsBySeller(this.state.currentUser.uid, 20, 1)
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

    render() {
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