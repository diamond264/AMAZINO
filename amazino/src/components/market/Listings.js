import React from 'react';

import ListingSummary from './ListingSummary';

const Listings = () => {
    var testData = {
        title: "Title",
        displayName: "rsteinwe",
        price: 30,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores commodi vel veritatis voluptates, nemo ratione, illo impedit magni dolor excepturi odit pariatur odio delectus rem labore autem error provident illum!",
        createdOn: new Date(),
        id: 20
    }

    return(
        <div className="row">
            <ListingSummary  {...testData}/>
            <ListingSummary  {...testData}/>
            <ListingSummary  {...testData}/>
            <ListingSummary  {...testData}/>
            <ListingSummary  {...testData}/>
        </div>
    )
}

export default Listings;