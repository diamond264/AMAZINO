import React, {Component} from 'react';
import {signUp, isSignIn} from '../../shared/Firebase'
import {Redirect} from 'react-router-dom'
import M from 'materialize-css';
import '../../App.css';



class SignUp extends Component {
    

    constructor(props) {
        super(props);

        this.signUpButton = this.signUpButton.bind(this);
        this.state = {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: '',
            signupSuccess: false
        }
    }

    //
    // Handle async signup
    //
    async signUpButton(e) {
        try {
            //await signUp('mf1il@googl.com', 'passasef', 'name');
            await signUp(this.state.email, this.state.password, this.state.displayName)
                .then( user => {
                    if(user){
                        this.setState({
                            signupSuccess: true
                        })
                        M.toast({html: 'Success!', classes: 'green'});
                    }
                });
        }
        catch (err) {
            console.log(err);
            this.handleError(err);
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

        if(this.state.password !== this.state.confirmPassword) this.handleError({message: "Passwords do no match"});
        if(this.state.displayName.length <= 5) this.handleError({message: "Display name too short"});
        else this.signUpButton(e);
    }

    handleError = (err) => {
        var errorText = err.message;

        if(err.code === "auth/invalid-email") errorText = "Invalid email";

        var options = {
            html: errorText,
            classes: 'error-toast'
        }

        M.toast(options);
    }

    render() {
        if (this.state.signupSuccess) return <Redirect to='/' />
        if(isSignIn()) return <Redirect to='/' />

        return(
            <div className="container section">
                <div className="row">
                    <div className="card col s10 offset-s1 m8 offset-m2 l6 offset-l3 xl4 offset-xl4">
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
                            <div className="input-field">
                                <label htmlFor="confirmPassword" >Confirm Password</label>
                                <input type="password" id="confirmPassword" onChange={this.handleChange} />
                            </div>
                            <div className="center section">
                                <button onClick={this.handleSubmit} className="btn z-depth-0 green white-text">sign up</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;