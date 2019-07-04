import React, {Component} from 'react';

import Listings from './Listings';

class Market extends Component {
    render() {
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