import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import M from 'materialize-css';

import {uploadItem, isSignIn} from '../../shared/Firebase'
import '../../App.css';

class CreateListing extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.postData = this.postData.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.state = {
            title: "",
            price: -1,
            images: "",
            content: "",
            category: "Category",
            user: "",
            itemSubmitted: false,
            betPeriodLength: 30,
            pluralModifier: "s",
            categories: ["Animals","Cars", "Electronics", "Tools", "Sports", "Other"],
            msPerDay: 86400000
        }
        M.AutoInit();
    }

    //
    // Post data to database
    //
    async postData() {
        try {
            var uid = this.state.user.uid;
            var dueDate = new Date();
            // Add days to duedate specified by user
            // dueDate = dueDate.setDate(dueDate.getDate() + this.state.betPeriodLength);
            dueDate = new Date(dueDate.getTime() + this.state.betPeriodLength * this.state.msPerDay);

            await uploadItem(uid, this.state.title, this.state.price, this.state.category, 
                dueDate, this.state.content, this.state.images)
                .then(() => {this.setState({
                    itemSubmitted: true
                })})
                .then(M.toast({html: 'Success!', classes: 'green'}));
        } catch(err) {
            console.log(err);
        }
    }

    componentDidMount = () => {
        this.setState({
            user: this.props.currentUser
        });
        M.AutoInit();
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handlePrice = (e) => {
        var price = parseInt(e.target.value, 10);
        this.setState({
            price
        })
    }

    handleFile = (e) => {
        this.setState({
            images: e.target.files[0]
        })
    }

    handleBetPeriod = (e) => {

        //
        // If bet slider at 1 day, remove pluralModifier "s" at end of days
        //
        var pluralModifier = "s";
        var betPeriodLength = parseInt(e.target.value, 10);
        if(betPeriodLength === 1){
            pluralModifier = "";
        }

        this.setState({
            betPeriodLength,
            pluralModifier
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.title.length === 0) this.handleError("Title is empty");
        else if (this.state.price <= 0) this.handleError("Price is too low");
        else if (this.state.content.length <= 5) this.handleError("Description too short");
        else if (this.state.category === "Category") this.handleError("Select a category");
        else {

            this.postData();

        }
        //console.log(this.state);
    }

    handleError = (errorText) => {
        var options = {
            html: errorText,
            classes: 'error-toast'
        }

        M.toast(options);
    }

    updateCategory = (category) => {
        this.setState({
            category
        })
    }

    handleDropdown = (e) => {
        e.preventDefault();
        
    }

    render() {

        if(!isSignIn()) return <Redirect to='/signin' />
        if(this.state.itemSubmitted) return <Redirect to='/market' />
        return(
            <div className="container section">
                <div className="card row">
                    <div className="card-content col s12">
                        <h4 className="center">Create Listing</h4>
                        <form onSubmit={e => this.handleSubmit(e)}>
                            <div className="row">
                                <div className="input-field col s12">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" id="title" onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s12 create-textarea">
                                    <label htmlFor="content">Description</label>
                                    <textarea placeholder="A description of your item" className="materialize-textarea" type="text" id="content" onChange={this.handleChange}></textarea>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s12 l6 file-field input-field">
                                    <div className="btn green darken-3 z-depth-0 white-text">
                                        <span>Image</span>
                                        <input type="file" id="images"
                                        accept=".jpg, .jpeg, .png" onChange={this.handleFile} />
                                    </div>
                                    <div className="file-path-wrapper">
                                        <input type="text" className="file-path validate"/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s2">
                                    <label htmlFor="price">Price</label>
                                    <input type="number" id="price" placeholder="USD" onChange={this.handlePrice} />
                                </div>
                            </div>
                            <div className="row">
                                    <div className="col s8 m6 l4 dropdown-trigger" data-target="date-dropdown">
                                        <a onClick={this.handleDropdown}  className="btn white grey-text z-depth-0 dropdown">{this.state.category}<i className="material-icons right">expand_more</i></a>
                                    </div>
                            </div>
                            <ul className="dropdown-content" id="date-dropdown">
                                {
                                    //
                                    // Map categories in state to dropdown
                                    //
                                    this.state.categories && this.state.categories.map(category => {
                                        return(
                                            <li key={category} onClick={() => this.updateCategory(category)}><a onClick={this.handleDropdown}>{category}</a></li>
                                        )
                                    })
                                }
                            </ul>
                            <div className="row">
                                <div className="col s6 m5 l4">
                                    <label htmlFor="betPeriodLength">Bet period length: {this.state.betPeriodLength} day{this.state.pluralModifier}</label>
                                    <p className="range-field"><input type="range" id="betPeriodLength" min="1" max="30" onChange={this.handleBetPeriod}/></p>
                                </div>
                            </div>

                            <div className="center">
                                <button type="submit" onClick={e => this.handleSubmit(e)} className="btn z-depth-1 green white-text">Create Listing</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateListing;