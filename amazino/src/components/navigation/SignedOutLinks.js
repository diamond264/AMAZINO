import React from 'react';
import {NavLink, Route} from 'react-router-dom';

import JunTest from '../JunTestPlace';

//
// Links a user sees on the navbar when signed out
// 
const SignedOutLinks = () => {
    return(
        <ul className="right">
            <li><NavLink to="/signup">Sign up</NavLink></li>
            <li><NavLink to="/login">Sign in</NavLink></li>
        </ul>
    )
}

export default SignedOutLinks;