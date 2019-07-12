import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {isSignIn, updateUserBalance, getUserDataFromID} from '../../shared/Firebase';
import {handleError, handleSuccess} from '../../shared/ErrorHandling';

class Profile extends Component {
    constructor(props) {
        super (props);
        this.state = {
            balance: 0,
            currentUser: this.props.currentUser,
            user: null,
            displayName: null,
            balanceToAdd: 0
        }
        
        this.updateBalance = this.updateBalance.bind(this);
    }



    componentDidMount = () => {
        this.getUserData();
        
    }

    async getUserData() {
        if(this.state.currentUser) {
            await getUserDataFromID(this.state.currentUser.uid).then(user => {
                this.setState({
                    user,
                    balance: (Math.round(user.balance * 100) / 100),
                    displayName: user.displayName
                })
            });
        }
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

    async updateBalance() {
        try {
            updateUserBalance(this.state.currentUser.uid, this.state.balanceToAdd).then(balance => {
                if(balance) {
                    balance = Math.round(balance * 100) / 100;
                    this.setState({balance});
                }
            })
        } catch(err) {
            handleError(err);
        }
    }

    render() {
        if(!isSignIn()) return <Redirect to="/"/>
        return(
            <div className="container z-depth-1">
                <h3 className="center">Profile</h3>
                <div className="divider"></div>
                <div className="row">
                    <div className="col s12">
                        <h5>Username: {this.state.displayName}</h5>
                        <p>Balance: ${this.state.balance.toFixed(2)}</p>
                    </div>
                </div>
                <div className="row">
                    <form onSubmit={this.handleBalanceUpdate}>
                        <div className="col s6 m5 l4 input-field">
                            <input type="number" id="balanceToAdd" value={this.state.balanceToAdd}
                                onChange={this.handleBalanceToAddChange}/>
                            <button className="btn" onClick={this.handleBalanceUpdate}>Add Balance</button>
                        </div>
                    </form>
                </div>
                <div className="divider"></div>
                <div className="row section center">
                    <div className="col s12">
                        <h5 className="grey-text text-darken-2">Listings</h5>
                        <div className="container z-depth-1">Insert Users Listings Here</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;