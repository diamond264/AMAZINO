import React, {Component} from 'react';
import {getBalance, updateBalance} from '../../shared/Firebase';

class Profile extends Component {
    constructor(props) {
        super (props);

        this.state = {
            balance: 0
        }
    }



    componentDidMount = async () => {
        let bal = await getBalance();
        this.setState({
            balance: bal
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    updateBalance = () => {
        updateBalance(this.state.balance);
    }

    render() {
        return(
            <div className="container z-depth-1">
                <h3 className="center">Profile</h3>
                <div className="divider"></div>
                <div className="section">
                    <h4>Username:</h4>
                </div>
                <div className="divider"></div>
                <div className="section">
                    <h4 className="section">Balance:
                        <input type="num" id="balance" value={this.state.balance}
                                        onChange={this.handleChange}/>
                        <button onClick={this.updateBalance}>Add Balance</button>
                    </h4>
                </div>
                <div className="divider"></div>
                <div className="section">
                    <h4>Listings:</h4>
                    <div className="container z-depth-1">Insert Users Listings Here</div>
                </div>
            </div>
        )
    }
}

export default Profile;