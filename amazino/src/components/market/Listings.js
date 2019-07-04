import React from 'react';

import ListingSummary from './ListingSummary';

const Listings = () => {
    var testData = [
        {
            title: "Bike",
            displayName: "rsteinwe",
            price: 20,
            dueDate: new Date(),
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores commodi vel veritatis voluptates, nemo ratione, illo impedit magni dolor excepturi odit pariatur odio delectus rem labore autem error provident illum!",
            createdOn: new Date()
        },
        {
            title: "Duck",
            displayName: "rsteinwe",
            price: 15,
            dueDate: new Date(),
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores commodi vel veritatis voluptates, nemo ratione, illo impedit magni dolor excepturi odit pariatur odio delectus rem labore autem error provident illum!",
            createdOn: new Date()
        },
        {
            title: "Crocodile",
            displayName: "rsteinwe",
            price: 30,
            dueDate: new Date(),
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores commodi vel veritatis voluptates, nemo ratione, illo impedit magni dolor excepturi odit pariatur odio delectus rem labore autem error provident illum!",
            createdOn: new Date()
        },
        {
            title: "Toast",
            displayName: "rsteinwe",
            price: 27,
            dueDate: new Date(),
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores commodi vel veritatis voluptates, nemo ratione, illo impedit magni dolor excepturi odit pariatur odio delectus rem labore autem error provident illum!",
            createdOn: new Date()
        },
        {
            title: "Apples",
            displayName: "rsteinwe",
            price: 250,
            dueDate: new Date(),
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores commodi vel veritatis voluptates, nemo ratione, illo impedit magni dolor excepturi odit pariatur odio delectus rem labore autem error provident illum!",
            createdOn: new Date()
        }
    ]

    return(
        <div className="row">
            {
                testData && testData.map(item => {
                    return (
                        <ListingSummary {...item} />
                    )
                })
            }
        </div>
    )
}

export default Listings;