import React, {Component} from 'react';
import {signUp} from '../../shared/Firebase'

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.signUpButton = this.signUpButton.bind(this);
    }

    async signUpButton(e) {
        try {
            await signUp('mf1il@googl.com', 'passasef', 'name');
        }
        catch (err) {
            console.log('eroror')
            console.log(err);
        }
    }

    render() {
        return(
            <div className="container">
                <h4>SignUp component</h4>
                display name: <input/>
                email: <input/>
                password: <input/>
                <button onClick={this.signUpButton}>signup</button>
            </div>
        )
    }
}

export default SignUp;