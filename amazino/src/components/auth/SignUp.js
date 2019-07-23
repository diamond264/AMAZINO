import React, {Component} from 'react';
import {signUp} from '../../shared/Firebase';
import {handleError, handleSuccess} from '../../shared/ErrorHandling';
import {Redirect} from 'react-router-dom'
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
                    
                    handleSuccess();
                    this.setState({
                        signupSuccess: true
                    })
                });
                
        }
        catch (err) {
            console.log(err);
            handleError(err);
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

        if(this.state.password !== this.state.confirmPassword) handleError({message: "Passwords do not match"});
        else if(this.state.displayName.length <= 5) handleError({message: "Display name too short"});
        else this.signUpButton(e);
    }

    render() {
        if(this.state.signupSuccess) return <Redirect to='/' />

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