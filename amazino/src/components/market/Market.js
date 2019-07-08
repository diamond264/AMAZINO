import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import Listings from './Listings';
import {isSignIn} from '../../shared/Firebase.js';

//
// Wrapper component for listings
//
class Market extends Component {
    state={
        data: [
            {
                title: "Bike",
                displayName: "rsteinwe",
                price: 20,
                dueDate: new Date(),
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores commodi vel veritatis voluptates, nemo ratione, illo impedit magni dolor excepturi odit pariatur odio delectus rem labore autem error provident illum!",
                createdOn: new Date(),
                id: 1
            },
            {
                title: "Duck",
                displayName: "rsteinwe",
                price: 15,
                dueDate: new Date(),
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores commodi vel veritatis voluptates, nemo ratione, illo impedit magni dolor excepturi odit pariatur odio delectus rem labore autem error provident illum!",
                createdOn: new Date(),
                id: 2
            },
            {
                title: "Crocodile",
                displayName: "rsteinwe",
                price: 30,
                dueDate: new Date(),
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores commodi vel veritatis voluptates, nemo ratione, illo impedit magni dolor excepturi odit pariatur odio delectus rem labore autem error provident illum!",
                createdOn: new Date(),
                id: 3
            },
            {
                title: "Toast",
                displayName: "rsteinwe",
                price: 27,
                dueDate: new Date(),
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores commodi vel veritatis voluptates, nemo ratione, illo impedit magni dolor excepturi odit pariatur odio delectus rem labore autem error provident illum!",
                createdOn: new Date(),
                id: 4
            },
            {
                title: "Apples",
                displayName: "rsteinwe",
                price: 250,
                dueDate: new Date(),
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores commodi vel veritatis voluptates, nemo ratione, illo impedit magni dolor excepturi odit pariatur odio delectus rem labore autem error provident illum!",
                createdOn: new Date(),
                id: 5
            }
        ]
    }
    
    render() {
        if(!isSignIn()) return <Redirect to='/signin' />
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