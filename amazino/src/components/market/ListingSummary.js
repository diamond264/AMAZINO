import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import '../../App.css';

import {getUserDataFromID, getImageByID} from '../../shared/Firebase';

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
        return (
            <div className="card col s12 m6 l4 xl3 market-fade z-depth-0">
                <NavLink to={'/listing/' + this.props.id} className="black-text">
                        <div className="card-content">
                            <h5 className="truncate">{this.props.name}</h5>
                            <div className="card-image" style={{height: "200px", overflow: "hidden"}}>
                                {this.state.img_src==""? <p className="grey-text">No Image</p> :
                                <img id="item-image" className="item-image" alt="Image" src={this.state.img_src}
                                    />}
                            </div>
                            <p className="grey-text text-darken-1">Price: ${this.props.price}</p>
                            <p className="truncate">{this.props.description}</p>
                            <div className="section">
                                <div className="divider"></div>
                                <p className="grey-text">by {this.state.displayName} on {this.state.postDate.getMonth() + 1}/{this.state.postDate.getDate()}/{this.state.postDate.getFullYear()}</p>
                            </div>
                        </div>
                </NavLink>
            </div>
        )
    }
}

export default ListingSummary;