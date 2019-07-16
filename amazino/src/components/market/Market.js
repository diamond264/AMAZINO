import React, {Component} from 'react';

import Listings from './Listings';
import {getAllItems, createBet, removeItem} from '../../shared/Firebase.js';

//
// Wrapper component for listings
//
class Market extends Component {
    constructor(props) {
        super(props);

        this.getData = this.getData.bind(this);
        

        this.state={
            data: null
        }
    }

    

    async getData() {
        var tempItems;
        var sortedItems = [];

        await getAllItems(20)
            .then(items => {
                if(items) {
                    // this.setState({
                    //     data: items
                    // });
                    // console.log(items);
                    tempItems = items;
                }
            });

        tempItems && Object.keys(tempItems).map(key => {
            var item = tempItems[key];
            item['itemID'] = key;
            sortedItems.push(item);
            return null;
        });

        sortedItems.sort((a, b) =>
            new Date(b['postDate']) - new Date(a['postDate']));

        console.log(sortedItems);
        this.setState({
            data: sortedItems
        });
    }

    componentWillMount = () => {
        console.log("TEST IS AVAILABLE");
        // createBet('-LjNqf3BHiWl2w4a4j_i','Ku6eNuqHcKSLyKFjPJjpGNNftib2',140).then(() => {
        //
        // }).catch((err) => {
        //     console.log(err);
        // });
        // removeItem('-LjUgvnVweh4v5w4t9nA').then(() => {
        //     console.log("item removed");
        // }).catch((err) => {
        //     console.log(err);
        // });
        // doRaffle('-LjUgvnVweh4v5w4t9nA').then((id) => {
        //     console.log(id);
        // }).catch((err) => {
        //     console.log(err);
        // });

        this.getData();
    };
    
    render() {
        return(
            <div className="container section">
                <div className="card z-depth-1">
                    <div className="card-content">
                        <div className="section">
                            <h4 className="center">Market</h4>
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <Listings {...this.state}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Market;