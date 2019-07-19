import React, {Component} from 'react';
import {NavLink, Link} from 'react-router-dom';
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
                    <li className="">
                        <Link to="" className="hamburger navbar-link"><i className="material-icons">account_circle</i></Link>
                    </li>
                    <li>
                        {this.props.user.notiItem + this.props.user.notiBet == 0 ? null:
                        <div className="noti"></div>}
                    </li>
                </ul>
                
                <ul className="right add-list">
                    <li>
                        <NavLink className="sidenav-close navbar-link" to="/create">
                            <i className="material-icons">add_to_photos</i>
                        </NavLink>
                    </li>
                </ul>

                <ul className="sidenav grey lighten-3" id="slide-out">
                    <li>
                        <div className="user-view">
                            <span><h5>{this.state.user.displayName}</h5></span>
                            <span className="grey-text email">Balance: ${this.state.user.balance.toFixed(2)}</span>
                        </div>
                    </li>

                    <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/profile"><p>Profile</p></NavLink></li>
                    <li className="divider"></li>
                    {/* <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/create"><p>Create</p></NavLink></li> */}
                    <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/listings">
                        <span class="new badge red right">{this.props.user.notiItem}</span>
                        <p>My Listings</p>
                    </NavLink></li>
                    <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/bets">
                        <span class="new badge red right">{this.props.user.notiBet}</span>
                        <p>My Bets</p>
                    </NavLink></li>
                    {/* <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/market"><p>Market</p></NavLink></li> */}
                    <li><NavLink className="sidenav-close" to="/signin" onClick={this.handleSignOut}><p>Logout</p></NavLink></li>
                </ul>
            </div>
        )
    }
}

export default SignedInLinks;