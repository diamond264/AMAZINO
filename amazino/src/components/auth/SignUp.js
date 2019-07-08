import React, {Component} from 'react';
import {signUp} from '../../shared/Firebase'
import {Redirect} from 'react-router-dom'



class SignUp extends Component {
    

    constructor(props) {
        super(props);

        this.signUpButton = this.signUpButton.bind(this);
        this.state = {
            displayName: '',
            email: '',
            password: '',
            signupSuccess: false
        }
    }

    async signUpButton(e) {
        try {
            //await signUp('mf1il@googl.com', 'passasef', 'name');
            await signUp(this.state.email, this.state.password, this.state.displayName)
                .then( user => {
                    if(user){
                        this.setState({
                            signupSuccess: true
                        })
                    }
                });
        }
        catch (err) {
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
    }

    render() {
        if (this.state.signupSuccess) return <Redirect to='/market' />

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