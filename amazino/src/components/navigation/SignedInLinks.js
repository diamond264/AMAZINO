import React, {Component} from 'react';
import {NavLink, Link} from 'react-router-dom';
import * as firebase from 'firebase/app';
import {getUserDataFromID, getNumNewNotifications} from '../../shared/Firebase';
import {handleError} from '../../shared/ErrorHandling';
import M from 'materialize-css';

//
// Links a user sees on the navbar when signed in
// 
class SignedInLinks extends Component{
    constructor(props) {
        super(props);

        this.state = {
            sidebarInstance: null,
            user: null,
            numNewNotifs: 0
        }
    }

    componentDidMount = () => {
        var elem = document.querySelector(".sidenav");
        var sidebarInstance = M.Sidenav.init(elem, {edge: 'left', inDuration: 200, outDuration: 150});

        if(this.props.currentUser) {
            this.getUserData(this.props.currentUser.uid);
        }

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

    handleClick = (e) => {
        if(this.props.currentUser) {
            this.getUserData(this.props.currentUser.uid);
        }
    }

    componentDidUpdate = () => {
        if(this.props.currentUser) {
            getNumNewNotifications(this.props.currentUser.uid).then(numNewNotifs => {
                this.setState({
                    numNewNotifs
                });
            }).catch(err => {
                handleError(err);
            });
        }
    }

    async getUserData(uid) {
        // get user data from database, update
        await getUserDataFromID(uid).then(user => {
            getNumNewNotifications(uid).then(numNewNotifs => {
                this.setState({
                    user,
                    numNewNotifs
                });
            }).catch(err => {
                handleError(err);
            })
            
        }).catch(err => {
            handleError(err);
        })

    }

    render() {
        var notifBadge = this.state.numNewNotifs ? (
            <span className="new badge red right">{this.state.numNewNotifs}</span>
        ) : null

        var slideoutContent = this.state.user ? (
            <div>
                <li>
                    <div className="user-view">
                        <span><h5>{this.state.user.displayName}</h5></span>
                        <span className="grey-text email">Balance: ${this.state.user.balance.toFixed(2)}</span>
                    </div>
                </li>

                <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/profile"><p>Profile</p></NavLink></li>
                
                {/* <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/create"><p>Create</p></NavLink></li> */}
                
                <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/notifications">
                    {notifBadge}
                    <p>Notifications</p>
                </NavLink></li>
                
                <li className="divider"></li>

                <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/listings">
                    {/*<span className="new badge red right">{this.state.user.notiItem}</span>*/}
                    <p>My Listings</p>
                </NavLink></li>

                <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/bets">
                    {/*<span className="new badge red right">{this.state.user.notiBet}</span>*/}
                    <p>My Bets</p>
                </NavLink></li>

                <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/rules"><p>Rules and FAQ</p></NavLink></li>
                <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/aboutus"><p>About Us</p></NavLink></li>

                {/* <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/faq"><p>FAQ</p></NavLink></li> */}

                {/* <li><NavLink className="sidenav-close" onClick={this.handleClick} to="/market"><p>Market</p></NavLink></li> */}
                <li><NavLink className="sidenav-close" to="/signin" onClick={this.handleSignOut}><p>Logout</p></NavLink></li>
            </div>
        ) : null

        return(
            <div>
                <ul className="right sidenav-trigger" data-target="slide-out">
                    <li className="">
                        <Link to="" onClick={this.handleClick} className="hamburger navbar-link"><i className="material-icons">account_circle</i></Link>
                    </li>
                    <li>
                        {this.state.user && this.state.numNewNotifs !== 0 ?
                        <div className="noti"><p>{this.state.numNewNotifs}</p></div> : null}
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
                {slideoutContent}
                </ul>
            </div>
        )
    }
}

export default SignedInLinks;