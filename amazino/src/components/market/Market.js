import React, {Component} from 'react';

import Listings from './Listings';
//import {getAllItems, createBet, removeItem, doRaffle} from '../../shared/Firebase.js';
import {getItemsByStatus, getUnSoldItems} from "../../shared/Firebase";

//
// Wrapper component for listings
//

class Market extends Component {
    constructor(props) {
        super(props);

        // this.getData = this.getData.bind(this);
        
        this.state = {
            categories: ["Animals","Cars", "Clothing", "Electronics", "Tools", "Sports", "Other"]
        }
        // this.state={
        //     data: null
        // }
    }

    

    // async getData() {
    //     await getAllItems(20, 1, this.props.search)
    //         .then(items => {
    //             if(items) {
    //                 this.setState({
    //                     data: items
    //                 });
    //             }
    //         });
    // }

    componentWillMount = () => {
        console.log("TEST IS AVAILABLE");
        // createBet('-LjNqf3BHiWl2w4a4j_i','Ku6eNuqHcKSLyKFjPJjpGNNftib2',140).then(() => {
        //
        // }).catch((err) => {
        //     console.log(err);
        // });
        // removeItem('-LjsdlnXkcG0NXAHqJvD').then(() => {
        //     console.log("item removed");
        // }).catch((err) => {
        //     console.log(err);
        // });
        // doRaffle('-LjXnZjO75iHw6toC8dp').then((id) => {
        //     console.log(id);
        // }).catch((err) => {
        //     console.log(err);
        // });

        this.props.getData();
    };
    
    render() {
        return(
            <div className="container section">
                <div className="card z-depth-1">
                    <div className="card-content">
                        <div className="section row">
                            {this.state.categories.map(c => {
                                return (
                                    <p className="col">
                                        <label>
                                            <input type="checkbox" />
                                            <span>{c}</span>
                                        </label>
                                    </p>
                                )
                            })}
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <Listings {...this.state} data={this.props.data}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Market;