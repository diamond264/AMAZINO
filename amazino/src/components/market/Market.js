import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import Listings from './Listings';
import {isSignIn} from '../../shared/Firebase.js';

class Market extends Component {
    render() {
        if(!isSignIn()) return <Redirect to='/signin' />
        return(
            <div className="container z-depth-1">
                <div className="section">
                    <h4 className="center">Market</h4>
                </div>
                <div className="divider"></div>
                <div className="section">
                    <Listings />
                </div>
            </div>
        )
    }
}

export default Market;