import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import '../../App.css';

import {getUserDataFromID, getImageByID, getPercentPurchased} from '../../shared/Firebase';
import {handleError} from '../../shared/ErrorHandling';

import ProgressBar from '../../shared/ProgressBar';

//
// Summarize a listing, to be viewed as a card within the Market
// or in user listing summary
//
class ListingSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postDate: null,
            dueDate: null,
            displayName: null,
            img_src: "",
            percentMap: [0,0],
            status: props.status
        }
    }

    componentWillMount = () => {
        var postDate = new Date(this.props.postDate);
        var dueDate = new Date(this.props.dueDate);
        this.setState({
            postDate,
            dueDate
        })
        this.getUserData();
        // this.loadImage();
    }

    componentDidMount = () => {
        this.loadImage();
        this.getPercentPurchased();
    }

    async getPercentPurchased() {
        try {
            await getPercentPurchased(this.props.id).then(percentPurchased => {
                this.setState({
                    percentMap: [percentPurchased, 0]
                })
            })

        } catch(err) {
            handleError(err);
        }
    }

    async getUserData() {
        await getUserDataFromID(this.props.seller).then(user => {
            this.setState({
                displayName: user.displayName
            })
        }).catch(err => {
            console.log(err);
        })
    }

    async loadImage() {
        await getImageByID(this.props.id)
            .then(url => {
                this.setState({
                    img_src: url,
                })
            }).catch((err) => {
                this.setState({
                    img_src: ""
                })
            });
    }

    render() {
        // console.log(this.props);
        var statusLabel = this.state.status === "waitForBet" ? (
            <label htmlFor="status" className="status-label" style={{backgroundColor: "green"}}>Waiting for bets</label>
        ) : (
            <label htmlFor="status" className="status-label" style={{backgroundColor: "#ec7e00"}}>Betting complete</label>
        )

        return (
            <div className="card col s12 m6 l4 xl3 market-fade z-depth-0">
                <NavLink to={'/listing/' + this.props.id} className="black-text">
                        <div className="card-content">
                            <h5 className="truncate">{this.props.name}</h5>
                            <div className="card-image" style={{height: "200px", overflow: "hidden"}}>
                                {this.state.img_src===""? <p className="grey-text">No Image</p> :
                                <img id="item-image" className="item-image" alt="item" src={this.state.img_src}
                                    />}
                            </div>

                            <div className="row">
                                <div className="col s12">
                                    <label htmlFor="progress">Progress: {Math.round(this.state.percentMap[0]*100)}%</label>
                                </div>
                                <ProgressBar height={20} percentMap={this.state.percentMap} />
                            </div>

                            <p className="grey-text text-darken-1">Price: ${this.props.price}</p>
                            <p className="truncate">{this.props.description}</p>
                            <div className="section" >
                                
                            </div>
                            
                            <div className="divider"></div>
                            
                            <p className="grey-text truncate">by {this.state.displayName} on {this.state.postDate.getMonth() + 1}/{this.state.postDate.getDate()}/{this.state.postDate.getFullYear()}</p>
                            {statusLabel}
                        </div>
                </NavLink>
            </div>
        )
    }
}

export default ListingSummary;