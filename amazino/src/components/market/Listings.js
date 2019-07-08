import React, {Component} from 'react';

import ListingSummary from './ListingSummary';

//
// Creates list of listings for market with data passed through props
//
class Listings extends Component {
    
    render() {
        const {data} = this.props;
        return(
            <div className="row">
                {
                    data && data.map(item => {
                        return (
                            <ListingSummary {...item} key={item.id}/>
                        )
                    })
                }
            </div>
        )
    }
}

export default Listings;