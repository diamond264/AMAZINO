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
            <div className="container">
                Balance: <input type="num" id="balance" value={this.state.balance} 
                            onChange={this.handleChange}/>
                <button onClick={this.updateBalance}>Add Balance</button>
            </div>
        )
    }
}

export default Profile;