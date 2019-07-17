import React, {Component} from 'react';

import '../App.css';

//
// Progress bar for bets
//
// Takes percentMap prop in form: [percentOthersBetted, percentUserBetted]
//
const ProgressBar = (props) => {
    var percentLeft = 1-props.percentMap[0]-props.percentMap[1];

    // determine whether to show bet label for user
    var myBetsLabel = props.percentMap[1] != 0 ? (
        <div class="right">
            <div className="progressbar-label orange darken-3"></div>
            <label htmlFor="userBet">Your bets: {props.percentMap[1] * 100}%</label>
        </div>
    ) : null

    var betLabel = props.label ? (
        <div>
            <div className="col s6" style={{marginBottom: "5px"}}>
                <label htmlFor="progress" className="black-text">Progress: {Math.round((1-percentLeft) * 100)}%</label>
            </div>
            <div className="col s6">
                {myBetsLabel}
            </div>
        </div>
    ) : null

    return(
        <div>
            {betLabel}
            <div className="col s12">
                <div className="green darken-3 progressbar-element" style={{width: (props.percentMap[0] * 100) + "%"}}></div>
                <div className="orange darken-3 progressbar-element" style={{width: (props.percentMap[1] * 100) + "%"}}></div>
                <div className="grey lighten-2 progressbar-element" style={{width: (percentLeft * 100) + "%"}}></div>
            </div>
        </div>
    )
}

export default ProgressBar;