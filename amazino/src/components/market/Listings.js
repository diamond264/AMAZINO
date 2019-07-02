import React from 'react';

import ListingSummary from './ListingSummary';

const Listings = () => {
    var testData = {
        title: "Title",
        price: 30,
        description: "Test description"
    }

    return(
        <div className="container">
            <div className="row">
                <ListingSummary  {...testData}/>
                <ListingSummary  {...testData}/>
                <ListingSummary  {...testData}/>
                <ListingSummary  {...testData}/>
                <ListingSummary  {...testData}/>
            </div>
        </div>
    )
}

export default Listings;