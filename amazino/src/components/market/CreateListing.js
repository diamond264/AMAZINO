import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import M from 'materialize-css';

import {uploadItem, isSignIn, getUserDataFromID} from '../../shared/Firebase'
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
            category: "Select One",
            user: "",
            itemSubmitted: false,
            betPeriodLength: "30",
            categories: ["Animals","Cars", "Electronics", "Tools", "Sports", "Other"]
        }
        
    }

    async postData() {
        try{
            await getUserDataFromID(this.state.user.uid)
                .then(user => {
                    var uid = this.state.user.uid;
                    var displayName = user.displayName;
                    var dueDate = new Date();

                    // Add days to duedate specified by user
                    dueDate = dueDate.setDate(dueDate.getDate() + parseInt(this.state.betPeriodLength, 10));

                    uploadItem(uid, displayName, this.state.title, this.state.price, this.state.category, dueDate, this.state.content)
                        .then(this.setState({
                            itemSubmitted: true
                        }))
                        .then(M.toast({html: 'Success!', classes: 'green'}));
                })
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

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.title.length === 0) this.handleError("Title is empty");
        else if (this.state.price <= 0) this.handleError("Price is too low");
        else if (this.state.content.length <= 5) this.handleError("Description too short");
        else if (this.state.category === "Select One") this.handleError("Select a category");
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
                                <div className="col s2">
                                    <label htmlFor="price">Price</label>
                                    <input type="number" id="price" placeholder="USD" onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s12">
                                    <label htmlFor="images">Images</label>
                                    <input type="url" id="images" placeholder="(Optional URL)" onChange={this.handleChange} />
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
                                <div className="col s10 m8 l6">
                                    <label htmlFor="betPeriodLength">Bet period length: {this.state.betPeriodLength} days</label>
                                    <p className="range-field"><input type="range" id="betPeriodLength" min="1" max="30" onChange={this.handleChange}/></p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col s12">
                                    <label htmlFor="content">Content</label>
                                    <textarea placeholder="A description of your item" className="materialize-textarea" type="text" id="content" onChange={this.handleChange}></textarea>
                                </div>
                            </div>
                            <div className="center">
                                <button type="submit" onClick={e => this.handleSubmit(e)} className="btn z-depth-0 green white-text">Create Listing</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateListing;