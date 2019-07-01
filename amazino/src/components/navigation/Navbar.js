import React from 'react';
import {Link} from 'react-router-dom';

import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';

const Navbar = () => {
    return(

        <nav className="nav-wrapper orange darken-2">
            <div className="container">
                <Link to="/" className="brand-logo white-text">Amazino</Link>
                <SignedInLinks />
                <SignedOutLinks />
            </div>
        </nav>
    )
}

export default Navbar;