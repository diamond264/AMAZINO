import React from 'react';

//
// Expects text string status, returns jsx label
//
export const getLabel = (status) => {
    var style;
    var text;

    if(status === "waitForBet") {
        style = {backgroundColor: "green"};
        text = "Waiting for bets";
    } else if(status === "readyToRaffle") {
        style = {backgroundColor: "#ec7e00"};
        text = "Betting complete";
    } else if(status === "SoldOut") {
        style = {backgroundColor: "red"};
        text = "Item sold";
    } else {
        style = {backgroundColor: "black"};
        text = "No status";
    }
    
    
    

    return (
        <label htmlFor="status" className="status-label" style={style}>{text}</label>
    )
}