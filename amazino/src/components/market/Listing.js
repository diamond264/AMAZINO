import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import {isSignIn, getItemFromID} from '../../shared/Firebase.js';

class Listing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemID: this.props.match.params.id,
            item: null,
            createdOn: null,
            dueDate: null
        }
        console.log(this.state.itemID);
    }

    componentWillMount = () => {
        this.getData();
    }

    
    async getData() {
            await getItemFromID(this.state.itemID)
                .then(item => {
                    var createdOn = new Date(item.postDate);
                    var dueDate = new Date(item.dueDate);
                    this.setState({
                        item,
                        createdOn,
                        dueDate
                    })
                    console.log(item);
                })
    }

    render() {
        var testData = {
            title: "Title",
            displayName: "rsteinwe",
            price: 30,
            dueDate: new Date(),
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores commodi vel veritatis voluptates, nemo ratione, illo impedit magni dolor excepturi odit pariatur odio delectus rem labore autem error provident illum!",
            createdOn: new Date()
        }
        if(!isSignIn()) return <Redirect to='/signin' />
        if(!this.state.item) return <div></div>
        return(
            <div className="container">
            <div className="card col s8 m4">
                <div className="card-content">
                    <h5>{this.state.item.name}</h5>
                    <p className="grey-text text-darken-1">Price: ${this.state.item.price}</p>
                    <p>{this.state.item.description}</p>
                    <div className="section row">
                        <div className="divider"></div>
                        <div className="col s6 left">
                            <p className="grey-text">by {this.state.item.displayName} on {this.state.createdOn.getMonth()+1}/{this.state.createdOn.getDate()}/{this.state.createdOn.getFullYear()}</p>
                        </div>
                        <div className="col s6 right">
                            <p className="right grey-text">ends on {this.state.dueDate.getMonth()+1}/{this.state.dueDate.getDate()}/{this.state.dueDate.getFullYear()}</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
        }
}

export default Listing;