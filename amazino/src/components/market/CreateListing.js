import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import {uploadItem, isSignIn, getUserDataFromID} from '../../shared/Firebase'

class CreateListing extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.postData = this.postData.bind(this);
        this.state = {
            title: "",
            price: -1,
            images: "",
            content: "",
            category: "",
            user: ""
        }

    }

    async postData() {
        try{
            await getUserDataFromID(this.state.user.uid)
                .then(user => {
                    console.log(user.val());
                });
        } catch(err) {
            console.log(err);
        }
    }

    componentWillMount = () => {
        this.setState({
            user: this.props.currentUser
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.postData();

        if (this.state.title.length === 0) alert("Title is empty");
        else if (this.state.price <= 0) alert("Price is too low");
        else if (this.state.content.length === 0) alert("Content is empty");
        else {

            //uploadItem("seller", this.state.title, this.state.price, "furniture", 
            //"0", this.state.content)

        }
        //console.log(this.state);
    }

    render() {
        console.log(this.state);

        if(!isSignIn()) return <Redirect to='/signin' />
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
                                <div className="col s12">
                                    <label htmlFor="category">Category</label>
                                    <input type="text" id="category" placeholder="Listing category" onChange={this.handleChange} />
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