import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';



class Navbar extends Component {
    render() {
        const {currentUser} = this.props;
        const links = currentUser ? <SignedInLinks /> : <SignedOutLinks />;
        return(
            <nav className="nav-wrapper orange darken-2">
                <div className="container">
                    <Link to="/" className="left brand-logo white-text">Amazino</Link>
                    {links}
                </div>
            </nav>
        )
    }
}

export default Navbar;