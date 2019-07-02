import React from 'react';

const Listing = (props) => {
    var testData = {
        title: "Title",
        displayName: "rsteinwe",
        price: 30,
        dueDate: new Date(),
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores commodi vel veritatis voluptates, nemo ratione, illo impedit magni dolor excepturi odit pariatur odio delectus rem labore autem error provident illum!",
        createdOn: new Date()
    }

    return(
        <div className="container">
        <div className="card col s8 m4">
            <div className="card-content">
                <h5>{testData.title}</h5>
                <p className="grey-text text-darken-1">Price: ${testData.price}</p>
                <p>{testData.description}</p>
                <div className="section row">
                    <div className="divider"></div>
                    <div className="col s6 left">
                        <p className="grey-text">by {testData.displayName} on {testData.createdOn.getMonth()}/{testData.createdOn.getDay()}/{testData.createdOn.getFullYear()}</p>
                    </div>
                    <div className="col s6 right">
                        <p className="right grey-text">ends on {testData.createdOn.getMonth()}/{testData.createdOn.getDay()}/{testData.createdOn.getFullYear()}</p>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Listing;