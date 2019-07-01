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

    handleSubmit = (e) => {
        // prevent default page refresh action
        e.preventDefault();

        this.signUpButton(e);
    }

    render() {
        return(
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <h4>Sign Up</h4>
                    <div className="input-field">
                        <label htmlFor="display-name">display name</label>
                        <input type="text" className="display-name" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="email">email</label>
                        <input type="email" className="email" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">password</label>
                        <input type="password" className="password" />
                    </div>
                    <button onClick={this.signUpButton} className="btn">sign up</button>
                </form>
            </div>
        )
    }
}

export default SignUp;