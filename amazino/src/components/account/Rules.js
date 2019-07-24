import React, {Component} from 'react';
//Mainly just a Text Page, Does not use functions from other files

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
                            <h5>DISCLAIMER</h5>
                            <p>
                                This site is suited for ages 18+. This is because this is a gambling game.
                                If you are having trouble with gambling please call 1-800-Gambler (426-2537)
                            </p>
                        </div>

                        <div className="row">
                            <h5>How to List Items</h5>
                            <p>In the top right of the website, there is the create listing button.</p>
                            <p> Step 1: Create a Title</p>
                            <p> Step 2: Give a description of the item you are selling</p>
                            <p> Step 3: Upload an image of your item (Optional)</p>
                            <p> Step 4: Set a price for your item</p>
                            <p> Step 5: Select a category for your item</p>
                            <p> Step 6: Set a date for when your item expires</p>
                        </div>
                        <div className="row">
                            <h5>How to Bet</h5>
                            <p> Step 1: Find an item that you want to bet on</p>
                            <p>
                                Step 2: Go to the items page and drag the bet bar to the desired percentage you wish to
                                bet. (If you bet less than 50% you can come back and increase by coming back to this page)
                            </p>
                            <p> Step 3: Wait for the item to reach 100% for the raffle to begin</p>
                        </div>

                        <div className="divider"></div>

                        <div className="row">
                            <div className="col s12 center">
                                <h4>FAQ</h4>
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

export default Rules;