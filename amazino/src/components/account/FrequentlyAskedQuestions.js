import React, {Component} from 'react';

class FrequentlyAskedQuestions extends Component {
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
                            <h5>What is Amazino?</h5>
                            <p>
                                Amazino is an e-commerce site with a twist. It is like any online market but the twist
                                is the betting. On this site you can bet from 0% to 50% of an items price (in
                                increments of 5%) and when that item reaches the asking price, a raffle will begin.
                                Your chance to win the item directly correlates to the percentage you paid.
                            </p>
                        </div>

                        <div className="row">
                            <h5>What happens when the item reaches 100%?</h5>
                            <p> The seller will be notified that their item have reached the desired price.</p>
                            <p>
                                The seller then has the option to begin the raffle and all parties will be notified
                                of the results.
                            </p>
                        </div>

                        <div className="row">
                            <h5>What happens if the combined bet do not reach 100% before the listing ends?</h5>
                            <p> All bets will be refunded to their refunded</p>
                        </div>

                        <div className="row">
                            <h5>How is the Winner Determined</h5>
                            <p>
                                Each item is separated in 20 parts because you bet in increments of 5%.
                                When 100% of the items price is reached, a raffle is done 1 out of the 20 pieces
                                is chosen.
                                The owner of said part is listed as the winner. Winners, losers, and the seller are all
                                notified.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FrequentlyAskedQuestions;