import React, {Component} from 'react';

class Rules extends Component {
    render() {
        return(
            <div className="container section">
                <div className="card z-depth-1">
                    <div className="card-content">
                        <div className="row">
                            <div className="col s12 center">
                                <h4>Rules</h4>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="row">
                            <h5>How to List Items</h5>
                            <p>Insert info about listings</p>
                        </div>
                        <div className="row">
                            <h5>How to Bet</h5>
                            <p>Insert info about bets</p>
                        </div>
                        <div className="row">
                            <h5>How is the Winner Determined</h5>
                            <p>Insert info about our algorithm</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Rules;