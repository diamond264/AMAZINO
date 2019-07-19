import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

import ListingSummary from './ListingSummary';

import '../../App.css';

//
// Creates list of listings for market with data passed through props
//
class Listings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1
        }
    }

    handleClick = (e) => {
        e.preventDefault();
    }

    handlePage = (e) => {
        e.preventDefault();
        console.log(e);
        var currentPage = parseInt(e.target.value);
        this.props.updatePage(currentPage);
        this.setState({
            currentPage
        })
    }

    getPageNumberElement = () => {
        var pageArray = [];
        pageArray.push()
        
        for(var i = 1; i < this.props.maxPages+1; i++) {
            pageArray.push(<li><button value={i} class="page-button" onClick={this.handlePage}>{i}</button></li>);
        }
        return pageArray;
    }
    
    render() {
        const {data} = this.props;
        return(
            <div>
                <div className="row">
                    {
                        
                        // data && Object.keys(data).map(key => {
                        //     var item = data[key];
                        //     return ( <ListingSummary {...item} id={key} key={key}/> )
                        // })

                        data && data.map(item => {
                            return (<ListingSummary {...item} id={item['itemID']} key={item['itemID']}/>)
                        })
                    }
                </div>
                <div className="row center">
                    <ul className="pagination">
                    {
                        this.props.updatePage && this.getPageNumberElement()
                    }
                    </ul>
                </div>
            </div>
        )
    }
}

export default Listings;