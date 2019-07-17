import React, {Component} from 'react';

import '../App.css';

//
// Progress bar for bets
//
// Takes percentMap prop in form: [percentOthersBetted, percentUserBetted, projectedPercent (optional)]
//
const ProgressBar = (props) => {
    var height = props.height ? props.height : 30
    
    var percentLeft = 1-props.percentMap[0]-props.percentMap[1];

    if(props.percentMap[2]) {
        percentLeft -= props.percentMap[2];
    }
    
    // label for my bet percent
    var myBetsLabel = props.percentMap[1] != 0 ? (
        <div className="right">
            <div className="progressbar-label green darken-3"></div>
            <label htmlFor="userBet">Your bets: {props.percentMap[1] * 100}%</label>
        </div>
    ) : null

    // label for projected percent
    var projectedLabel = props.percentMap[2] ? (
        <div className="right">
            <div className="progressbar-label green lighten-3"></div>
            <label htmlFor="userBet">Projected bet: {Math.round((props.percentMap[1] + props.percentMap[2]) * 100)}%</label>
        </div>
    ) : null

    // determine whether to show bet label for user
    var betLabel = props.label ? (
        <div>
            <div className="col s4" style={{marginBottom: "5px"}}>
                <label htmlFor="progress" className="black-text">Progress: {Math.round((1-percentLeft) * 100)}%</label>
            </div>
            <div className="col s8">
                {myBetsLabel}
                {projectedLabel}
            </div>
        </div>
    ) : null

    return(
        <div>
            {betLabel}
            <div className="col s12">
                <div className="orange darken-3 progressbar-element" style={{height: props.height + "px", width: (props.percentMap[0] * 100) + "%"}}></div>
                <div className="green darken-3 progressbar-element" style={{height: props.height + "px", width: (props.percentMap[1] * 100) + "%"}}></div>
                <div className="green lighten-3 progressbar-element" style={{height: props.height + "px", width: (props.percentMap[2] * 100) + "%"}}></div>
                <div className="grey lighten-1 progressbar-element" style={{height: props.height + "px", width: (percentLeft * 100) + "%"}}></div>
            </div>
        </div>
    )
}

export default ProgressBar;