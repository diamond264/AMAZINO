import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';

import {getUserDataFromID} from '../../shared/Firebase';

import '../../App.css';



class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            searchExpanded: false,
            query: "",
            searchbarStyle: {
                width: "0%",
                height: "0px",
                paddingLeft: "0px",
                paddingRight: "0px"
                
            }
        }
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.updateSearch(this.state.query);
    }

    handleSearchbar = (e) => {
        e.preventDefault();
        
        var width;
        var height;
        var paddingLeft;
        var paddingRight;
        var searchbarStyle;

        if(this.state.searchExpanded) {
            width = "0%";
            height = "0px"
            paddingLeft = "0px";
            paddingRight = "0px";
            this.props.updateSearch("");

        } else {
            height = "10px";
            width = "100%";
            paddingLeft = "20px";
            paddingRight = "20px";
        }

        searchbarStyle = {
            width,
            height,
            paddingLeft,
            paddingRight
        }

        this.setState({
            searchbarStyle,
            searchExpanded: !this.state.searchExpanded
        })

    }

    componentDidUpdate = () => {
        if(this.props.currentUser) {
            this.getUserData(this.props.currentUser.uid);
        }
    }

    async getUserData(uid) {
        // get user data from database, update
        await getUserDataFromID(uid).then(user => {
            this.setState({
                user
            });
        })
    }

    updateSearchInput = (e) => {
        this.props.updateSearch(e.target.value);
        this.setState({
            query: e.target.value
        })
    }

    render() {

        const links = this.props.currentUser && this.state.user ? <SignedInLinks {...this.state} /> : <SignedOutLinks />;
        return(
            <div>
                <nav className="nav-wrapper z-depth-1">
                    <div className="container row">
                        <Link to="/" className="left brand-logo white-text">Amazino</Link>

                        {links}
                        
                        <div className="left search-icon right">
                                <Link to="" onClick={this.handleSearchbar}><i className="material-icons">search</i></Link>
                        </div>
                        <div className="col s6 bold middle right input-field">
                            <div className="right searchbarContainer" style={this.state.searchbarStyle}>
                                <form className="searchbar" action="submit"  onSubmit={this.handleSearch}>
                                    <div>
                                        <input id="search bold" type="text" required  onChange={this.updateSearchInput}/>
                                    </div>         
                                </form>
                            </div>
                        </div>
                        
                    </div>
                </nav>
            </div>
        )
    }
}

export default Navbar;