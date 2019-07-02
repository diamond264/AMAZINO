import React, {Component} from 'react';
import {signUp} from '../../shared/Firebase'



class SignUp extends Component {
    state = {
        displayName: '',
        email: '',
        password: ''
    }

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

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        // prevent default page refresh action
        e.preventDefault();

        this.signUpButton(e);

        // log state for debug
        console.log(this.state);
    }

    render() {
        return(
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <h4>Sign Up</h4>
                    <div className="input-field">
                        <label htmlFor="displayName">display name</label>
                        <input type="text" id="displayName" onChange={this.handleChange} />
                    </div>
                    <div className="input-field">
                        <label htmlFor="email">email</label>
                        <input type="email" id="email" onChange={this.handleChange} />
                    </div>
                    <div className="input-field">
                        <label htmlFor="password" >password</label>
                        <input type="password" id="password" onChange={this.handleChange} />
                    </div>
                    <button onClick={this.signUpButton} className="btn">sign up</button>
                </form>
            </div>
        )
    }
}

export default SignUp;