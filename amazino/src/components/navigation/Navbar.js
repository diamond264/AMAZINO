import React from 'react';
import {Link} from 'react-router-dom';

import {isSignIn} from '../../shared/Firebase'
import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';

let links;
if (isSignIn()) links = <SignedInLinks />
else links = <SignedOutLinks />

const Navbar = () => {
    return(
        <nav className="nav-wrapper orange darken-2">
            <div className="container">
                <Link to="/" className="brand-logo white-text">Amazino</Link>
                {links}
            </div>
        </nav>
    )
}

export default Navbar;