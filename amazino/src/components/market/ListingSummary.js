import React from 'react';

//
// Summarize a listing, to be viewed as a card within the Market
// or in user listing summary
//
const ListingSummary = (props) => {
    return (
        <div className="card col s8 m4">
            <div className="card-content">
                <h5>{props.title}</h5>
                <p className="grey-text">Price: ${props.price}</p>
                <p className="truncate">{props.description}</p>
            </div>
        </div>
    )
}

export default ListingSummary;