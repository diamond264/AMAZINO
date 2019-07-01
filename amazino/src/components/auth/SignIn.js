import React, {Component} from 'react';
import {signIn} from '../../shared/Firebase'

class SignIn extends Component {
    constructor(props) {
        super(props);

        this.signInButton = this.signInButton.bind(this);
    }

    async signInButton(e) {
        try {
            await signIn('emaf123il@googl.com', 'passasef');
        }
        catch (err) {
            console.log(err);
        }
    }

    render() {
        return(
            <div className="container">
                <h4>SignIn component</h4>
                email: <input/>
                password: <input/>
                <button onClick={this.signInButton}>signin</button>
            </div>
        )
    }
}

export default SignIn;