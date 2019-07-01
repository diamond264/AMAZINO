import React from 'react';
import {NavLink} from 'react-router-dom';

//
// Links a user sees on the navbar when signed out
// 
const SignedOutLinks = () => {
    return(
        <ul className="right">
            <li><NavLink to="/signup">Sign up</NavLink></li>
            <li><NavLink to="/login">Log in</NavLink></li>
        </ul>
    )
}

export default SignedOutLinks;