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
            <div className="container section">
                <div className="row">
                    <div className="card col s4 offset-s4">
                        <form onSubmit={this.handleSubmit} className="card-content">
                            <h4 className="center">Sign Up</h4>
                            <div className="input-field">
                                <label htmlFor="displayName">Display Name</label>
                                <input type="text" id="displayName" onChange={this.handleChange} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" onChange={this.handleChange} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="password" >Password</label>
                                <input type="password" id="password" onChange={this.handleChange} />
                            </div>
                            <div className="center">
                                <button onClick={this.signUpButton} className="btn z-depth-0 green white-text">sign up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;