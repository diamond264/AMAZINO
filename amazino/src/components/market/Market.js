import React, {Component} from 'react';

import Listings from './Listings';

class Market extends Component {
    render() {
        return(
            <div className="container">
                <h4>Market</h4>
                <div className="section"></div>
                <Listings />
            </div>
        )
    }
}

export default Market;