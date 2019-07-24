import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {updateUserBalance, getUserDataFromID} from '../../shared/Firebase';
import {handleError, handleSuccess} from '../../shared/ErrorHandling';

import ProfileUpdateForm from './ProfileUpdateForm';

class Profile extends Component {
    /*Constructor for the data used by the Profile Page */
    constructor(props) {
        super (props);
        this.state = {
            profileuid: this.props.match.params.id,
            balance: 0,
            currentUser: this.props.currentUser,
            user: null,
            displayName: null,
            balanceToAdd: 0,
            data: null,
            editFormVisible: false,
            invalidUser: false
        }
        this.updateBalance = this.updateBalance.bind(this);
    }

    componentDidMount = () => {
        this.getUserData();
    }

    /*Gets User Data from the UID*/
    //Sets the Display Name to the UID display name
    //Grabs the balance from the database
    async getUserData() {
        await getUserDataFromID(this.state.profileuid).then(user => {
            this.setState({
                user,
                balance: (Math.round(user.balance * 100) / 100),
                displayName: user.displayName
            })
        }).catch(err => {
            this.setState({
                invalidUser: true
            })
            handleError({message: "User not found"});
        });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    handleBalanceToAddChange = (e) => {
        var balanceToAdd = parseInt(e.target.value, 10);
        this.setState({
            balanceToAdd
        })
    }

    handleBalanceUpdate = (e) => {
        e.preventDefault();
        this.updateBalance();
    }

    showProfileUpdateForm = () => {
        this.setState({
            editFormVisible: true
        });
    }

    hideProfileUpdateForm = () => {
        this.setState({
            editFormVisible: false
        });
        this.getUserData();
    }

    //Function for updating from the database
    async updateBalance() {
        try {
            updateUserBalance(this.state.currentUser.uid, this.state.balanceToAdd).then(balance => {
                if(balance) {
                    balance = Math.round(balance * 100) / 100;
                    this.setState({balance});
                    handleSuccess();
                } else {
                    handleError({message: "User balance not found"})
                }

            })
        } catch(err) {
            handleError(err);
        }
    }

    render() {

        // choose bio text to display
        var bio = this.state.user && this.state.user.bio ? (
            <div className="col s12">
                <p>{this.state.user.bio}</p>
            </div>
        ) : (
            <div className="col s12">
                <p>User has no bio.</p>
            </div>
        )

        // Info to be displayed only for the user currenty logged in
        var loggedInInfo = this.props.currentUser && this.props.currentUser.uid === this.state.profileuid && this.state.user ? (
            <div className="row">
                <div className="col s12">
                    <p>Email: {this.state.user.email}</p>
                </div>
                
                <div className="col s12">
                    <div className="section"></div>
                    <h6>Balance: ${this.state.balance.toFixed(2)}</h6>
                </div>
                <form onSubmit={this.handleBalanceUpdate}>
                    <div className="col s6 m5 l4 input-field">
                        <input type="number" id="balanceToAdd" value={this.state.balanceToAdd}
                                onChange={this.handleBalanceToAddChange}/>
                    </div>
                    <div className="col s6 input-field">
                        <button style={{bottom: 0}} className="btn green" onClick={this.handleBalanceUpdate}>Add Balance</button>
                    </div>
                </form>
                <div className="col s12 section">
                    <div className="divider"></div>
                    <div className="section"></div>
                </div>
                
                {
                    // Display edit profile form conditionally
                    this.state.editFormVisible ? (
                        <ProfileUpdateForm uid={this.props.currentUser.uid} user={this.state.user} hideProfileUpdateForm={this.hideProfileUpdateForm}/>
                    ) : (
                        <div className="col s12 section">
                            <button className="btn green darken-3" onClick={this.showProfileUpdateForm}>Update profile info</button>
                        </div>
                    )
                }
            </div>
        ) : null

        // display profile only if valid uid
        var profileDisplay = !this.state.invalidUser ? (
            <div className="card-content">
                <div className="row">
                    <div className="col s12 center">
                        <h4>Profile</h4>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="row">
                    <div className="col s12">
                        <h5>Username: {this.state.displayName}</h5>
                    </div>
                            
                    {bio}
                </div>
                        
                {loggedInInfo}

            </div>
        ) : (
            <div className="card-content">
                <div className="row">
                    <div className="col s12 center">
                        <h5>Oops! This is not a valid profile.</h5>
                        <div className="section"></div>
                    </div>
                    <div className="col s12 divider"></div>
                    <div className="col s12 center">
                        <div className="section"></div>
                        <Link to="/" className="btn green">Return to market</Link>
                    </div>
                </div>
            </div>
        )


        return(
            <div className="container section">
                <div className="card z-depth-1">
                    {profileDisplay}
                </div>
            </div>
        )
    }
}

export default Profile;