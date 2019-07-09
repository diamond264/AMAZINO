import React, {Component} from 'react';
import {signIn, isSignIn} from '../../shared/Firebase'
import {Redirect} from 'react-router-dom'

class SignIn extends Component {
    

    constructor(props) {
        super(props);

        this.signInButton = this.signInButton.bind(this);

        this.state = {
            email: '',
            password: '',
            loginSuccess: false
        }
    }

    //
    // Perform async authentication
    //
    async signInButton(e) {
        try {
            //await signIn('emaf123il@googl.com', 'passasef');
            await signIn(this.state.email, this.state.password)
                .then( user => {
                    if(user){
                        this.setState({
                            loginSuccess: true
                        })
                    }
                });
        }
        catch (err) {
            console.log(err);
            
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.signInButton(e);
    }

    handleChange = (e) => {
        // update state with new field
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render() {
        if (this.state.loginSuccess) return <Redirect to='/' />
        if(isSignIn()) return <Redirect to='/' />

        return(
            <div className="container section">
                <div className="row">
                    <div className="card col s10 offset-s1 m8 offset-m2 l6 offset-l3 xl4 offset-xl4">
                        <form className="card-content" onSubmit={this.handleSubmit}>
                            <h4 className="center">Sign In</h4>
                            <div className="input-field">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" onChange={this.handleChange} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" onChange={this.handleChange} />
                            </div>
                            <div className="center section">
                                    <button onClick={this.signInButton} className="btn z-depth-0 green white-text">sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignIn;