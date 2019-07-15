import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import * as firebase from 'firebase/app';
import M from 'materialize-css';



//
// Links a user sees on the navbar when signed in
// 
class SignedInLinks extends Component{
    constructor(props) {
        super(props);

        this.state = {
            sidebarInstance: null,
            user: props.user
        }
    }

    componentDidMount = () => {
        var elem = document.querySelector(".sidenav");
        var sidebarInstance = M.Sidenav.init(elem, {edge: 'left', inDuration: 200, outDuration: 150});

        this.setState({
            sidebarInstance
        });
    }    

    handleSignOut = () => {
        firebase.auth().signOut().then(() => {
            console.log("logout success");
        }).catch(err => {
            console.log(err);
        })
    }
    
    render() {
        return(
            <div>
                <ul className="right sidenav-trigger" data-target="slide-out">
                    <li>
                        <NavLink className="hamburger"><i className="material-icons">menu</i></NavLink>
                    </li>
                </ul>
                <ul className="sidenav grey lighten-3" id="slide-out">
                    
                    <li>
                        <div className="user-view">
                            <span><h5>{this.state.user.displayName}</h5></span>
                            <span class="grey-text email">Balance: ${this.state.user.balance.toFixed(2)}</span>
                        </div>
                    </li>

                    <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/profile"><p>Profile</p></NavLink></li>
                    <li className="divider"></li>
                    <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/market"><p>Market</p></NavLink></li>
                    <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/create"><p>Create</p></NavLink></li>
                    <li><NavLink className="sidenav-close"to="/" onClick={this.handleSignOut}><p>Logout</p></NavLink></li>
                </ul>
            </div>
        )
    }
}

export default SignedInLinks;