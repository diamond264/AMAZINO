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
                    </div>
                </div>
            </div>
        )
    }
}

export default FrequentlyAskedQuestions;