import React, {Component} from 'react';
import Listings from './Listings';
//import {getItemsByStatus, getBetItemsByUser} from "../../shared/Firebase";

//
// Wrapper component for listings
//

class Market extends Component {
    constructor(props) {
        super(props);

        // this.getData = this.getData.bind(this);
        this.state = {
            categories: ["Animals","Cars", "Clothing", "Cooking", "Electronics", "Garden", "Tools", "Sports", "Other"]
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

    componentDidMount = () => {
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
        // getBetItemsByUser('tJjZ01wjFYaGdvwElEG1dzyMuga2').then(() => {}).catch((err) => {console.log(err)});

        this.props.getData("", this.props.filter, 1);
    }

    updatePage = (pageNumber) => {
        this.props.getData("", this.props.filter, pageNumber);
    }
    
    render() {
        return(
            <div className="container section">
                <div className="card z-depth-1">
                    <div className="card-content">
                        <div className="section row">
                            {this.state.categories.map(c => {
                                return (
                                    <p className="col" style={{width: '130px'}} key={c}>
                                        <label>
                                            <input type="checkbox" className="filled-in" checked={this.props.filter[c]} name={c} 
                                                id={c} onClick={this.props.updateFilter}/>
                                            <span>{c}</span>
                                        </label>
                                    </p>
                                )
                            })}
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <Listings maxPages={this.props.maxPages} data={this.props.data} updatePage={this.updatePage} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Market;