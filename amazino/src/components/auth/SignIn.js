import React, {Component} from 'react';
import {signIn, isSignIn} from '../../shared/Firebase';
import {handleError, handleSuccess} from '../../shared/ErrorHandling';
import {Redirect} from 'react-router-dom';

import '../../App.css';

class SignIn extends Component {
    

    constructor(props) {
        super(props);

        this.signInButton = this.signInButton.bind(this);

        this.state = {
            email: '',
            password: '',
            signinSuccess: false
        }
    }

    //
    // Perform async authentication
    //
    async signInButton(e) {
        if(isSignIn()) {
            handleError({message: "Already signed in"});
            this.setState({
                signinSuccess: true
            })
        } else {
            try {
                //await signIn('emaf123il@googl.com', 'passasef');
                await signIn(this.state.email, this.state.password)
                    .then( user => {
                        if(user){
                            handleSuccess();
                            this.setState({
                                signinSuccess: true
                            })
                        }
                    });
            }
            catch (err) {
                console.log(err);
                handleError(err);
                
            }
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
        if(this.state.signinSuccess) return <Redirect to='/' />
        if(this.props.currentUser) return <Redirect to='/' />

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
                                    <button onClick={this.handleSubmit} className="btn z-depth-0 green white-text">sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignIn;