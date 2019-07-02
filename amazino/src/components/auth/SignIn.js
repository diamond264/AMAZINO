import React, {Component} from 'react';
import {signIn} from '../../shared/Firebase'

class SignIn extends Component {
    state = {
        email: '',
        password: ''
    }

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

        // log state for debug
        console.log(this.state);
    }

    handleChange = (e) => {
        // update state with new field
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render() {
        return(
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <h4>Sign In</h4>
                    <div className="input-field">
                        <label htmlFor="email">email</label>
                        <input type="email" id="email" onChange={this.handleChange} />
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">password</label>
                        <input type="password" id="password" onChange={this.handleChange} />
                    </div>
                    <button onClick={this.signInButton} className="btn">sign in</button>
                </form>
            </div>
        )
    }
}

export default SignIn;