import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {updateUserBalance, getUserDataFromID, getItemsBySeller} from '../../shared/Firebase';
import {handleError, handleSuccess} from '../../shared/ErrorHandling';
import Listings from '../market/Listings';

class Profile extends Component {
    constructor(props) {
        super (props);
        this.state = {
            balance: 0,
            currentUser: this.props.currentUser,
            user: null,
            displayName: null,
            balanceToAdd: 0,
            data: null
        }


        this.updateBalance = this.updateBalance.bind(this);
    }



    componentDidMount = () => {
        this.getUserData();
        this.getData();

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

        //       if(this.state.currentUser) {
        //    await getItemsBySeller(this.state.currentUser.uid)
        //        .then( items => {
        //            if(items) {
        //                this.setState( {
        //                    data: items
        //                });
        //            }
        //        });
        //}
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
        if(!this.props.currentUser) return <Redirect to="/"/>
        return(
            <div className="container section">
                <div className="card z-depth-1">
                    <div className="card-content">
                        <div className="row">
                            <div className="col s12 center">
                                <h4>Profile</h4>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="row">
                            <div className="col s12">
                                <h5>{this.state.displayName}</h5>
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
                            <div className="col s12 card z-depth-0">
                                <div className="section"></div>
                                <h5 className="grey-text text-darken-2">Listings</h5>
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
export default Profile;