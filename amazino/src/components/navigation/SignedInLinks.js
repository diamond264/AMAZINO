import React from 'react';
import {NavLink} from 'react-router-dom';

//
// Links a user sees on the navbar when signed in
// 
const SignedInLinks = () => {
    return(
        <ul className="right">
            <li><NavLink to="/market">Market</NavLink></li>
            <li><NavLink to="/create">Create listing</NavLink></li>
            <li><NavLink to="/logout">Logout</NavLink></li>
        </ul>
    )
}

export default SignedInLinks;