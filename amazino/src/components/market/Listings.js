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
                    
                    // data && Object.keys(data).map(key => {
                    //     var item = data[key];
                    //     return ( <ListingSummary {...item} id={key} key={key}/> )
                    // })

                    data && data.map(item => {
                        return ( <ListingSummary {...item} id={item['itemID']} key={item['itemID']}/> )
                    })
                }
            </div>
        )
    }
}

export default Listings;