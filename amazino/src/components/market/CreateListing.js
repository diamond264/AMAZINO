import React, {Component} from 'react';

class CreateListing extends Component {

    state = {
        title: "",
        price: -1,
        images: "",
        content: ""
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        //
        // log state for debug
        //
        console.log(this.state);
    }

    render() {
        return(
            <div className="container section">
                <div className="card row">
                    <div className="card-content col s12">
                        <h4 className="center">Create Listing</h4>
                        <form onSubmit={this.handleSubmit}>
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
                                    <label htmlFor="content">Content</label>
                                    <textarea placeholder="A description of your item" className="materialize-textarea" type="text" id="content" onChange={this.handleChange}></textarea>
                                </div>
                            </div>
                            <div className="center">
                                <button onClick={this.handleSubmit} className="btn z-depth-0 green white-text">Create Listing</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateListing;