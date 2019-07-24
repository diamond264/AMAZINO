import React, {Component} from 'react';
import Listings from './Listings';
//import {getItemsByStatus, getBetItemsByUser} from "../../shared/Firebase";

//
// Wrapper component for listings
//

class Market extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: ["Animals","Cars", "Clothing", "Cooking", "Electronics", "Garden", "Tools", "Sports", "Other"]
        }
    }

    componentDidMount = () => {
        console.log("TEST IS AVAILABLE");
        this.props.getData("", this.props.filter, 1);
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
                                                id={c} onChange={this.props.updateFilter}/>
                                            <span>{c}</span>
                                        </label>
                                    </p>
                                )
                            })}
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <Listings maxPages={this.props.maxPages} data={this.props.data} updatePage={this.props.updatePage} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Market;