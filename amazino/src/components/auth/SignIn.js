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

    handleSubmit = (e) => {
        e.preventDefault();
        this.signInButton(e);
    }

    render() {
        return(
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <h4>Sign In</h4>
                    <div className="input-field">
                        <label htmlFor="email">email</label>
                        <input type="email" className="email" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">password</label>
                        <input type="password" className="password" />
                    </div>
                    <button onClick={this.signInButton} className="btn">sign in</button>
                </form>
            </div>
        )
    }
}

export default SignIn;