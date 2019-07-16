import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';

import {getUserDataFromID} from '../../shared/Firebase';

import '../../App.css';



class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }

    componentDidUpdate = () => {
        if(this.props.currentUser) {
            this.getUserData(this.props.currentUser.uid);
        }
    }

    async getUserData(uid) {
        // get user data from database, update
        await getUserDataFromID(uid).then(user => {
            this.setState({
                user
            });
        })
    }

    render() {
        const links = this.props.currentUser && this.state.user ? <SignedInLinks {...this.state} /> : <SignedOutLinks />;
        return(
            <div>
                <nav className="nav-wrapper z-depth-1">
                    <div className="container">
                        <Link to="/" className="left brand-logo white-text">Amazino</Link>
                        {links}
                    </div>
                </nav>
            </div>
        )
    }
}

export default Navbar;