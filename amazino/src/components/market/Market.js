import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import Listings from './Listings';
import {isSignIn, getAllItems} from '../../shared/Firebase.js';

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

        await getAllItems(10)
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
        });

        sortedItems.sort((a, b) =>
            new Date(b['postDate']) - new Date(a['postDate']));

        console.log(sortedItems);
        this.setState({
            data: sortedItems
        });
    }

    componentWillMount = () => {
        this.getData();
    };
    
    render() {
        return(
            <div className="container z-depth-1">
                <div className="section">
                    <h4 className="center">Market</h4>
                </div>
                <div className="divider"></div>
                <div className="section">
                    <Listings {...this.state}/>
                </div>
            </div>
        )
    }
}

export default Market;