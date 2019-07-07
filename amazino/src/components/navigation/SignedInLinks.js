import React, {Component} from 'react';
import {NavLink, Redirect} from 'react-router-dom';
import * as firebase from 'firebase/app';



//
// Links a user sees on the navbar when signed in
// 
class SignedInLinks extends Component{
    handleSignOut = () => {
        firebase.auth().signOut().then(() => {
            console.log("logout success");
        }).catch(err => {
            console.log(err);
        })
    }
    
    render() {
        return(
            <ul className="right">
                <li><NavLink to="/market">Market</NavLink></li>
                <li><NavLink to="/create">Create listing</NavLink></li>
                <li><NavLink to="/" onClick={this.handleSignOut}>Logout</NavLink></li>
            </ul>
        )
    }
}

export default SignedInLinks;