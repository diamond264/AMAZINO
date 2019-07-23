import React, {Component} from 'react';
import {NavLink, Link, Redirect} from 'react-router-dom';

import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';

import '../../App.css';



class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchExpanded: false,
            query: "",
            searchbarStyle: {
                width: "0%",
                height: "0px",
                paddingLeft: "0px",
                paddingRight: "0px",
                opacity: 0,
                searchbarRedirect: false
                
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
        var opacity;

        var searchbarStyle;

        if(this.state.searchExpanded) {
            width = "0%";
            height = "0px"
            paddingLeft = "0px";
            paddingRight = "0px";
            opacity = 0;
            this.props.updateSearch("");

        } else {
            height = "10px";
            width = "100%";
            paddingLeft = "20px";
            paddingRight = "20px";
            opacity = 1;
        }

        searchbarStyle = {
            width,
            height,
            paddingLeft,
            paddingRight,
            opacity
        }

        this.setState({
            searchbarStyle,
            searchExpanded: !this.state.searchExpanded,
            searchbarRedirect: true
        })

    }

    updateSearchInput = (e) => {
        this.props.updateSearch(e.target.value);
        this.setState({
            query: e.target.value
        })
    }

    render() {
        const links = this.props.currentUser ? 
            <SignedInLinks currentUser={this.props.currentUser} /> : <SignedOutLinks />;

        var redirect = this.state.searchbarRedirect ? (
            <Redirect to="/" />
        ) : null

        if(this.state.searchbarRedirect) {
            this.setState({
                searchbarRedirect: false
            })
        }

        return(
            <div>
                <nav className="nav-wrapper z-depth-1">
                    <div className="container row">
                        <Link to="/" className="left brand-logo white-text">Amazino</Link>

                        {links}
                        
                        <ul className="right">
                            <NavLink to="" className="navbar-link search-icon" onClick={this.handleSearchbar}>
                                <li>
                                    <i className="material-icons">search</i>
                                </li>
                            </NavLink>
                        </ul>
                        <ul className="col s6 bold middle right input-field">
                            <li className="right searchbarContainer" style={this.state.searchbarStyle}>
                                <form className="searchbar" action="submit"  onSubmit={this.handleSearch}>
                                    <div>
                                        <input id="search bold" placeholder="search" type="text" required  onChange={this.updateSearchInput}/>
                                    </div>         
                                </form>
                            </li>
                        </ul>
                        
                    </div>
                </nav>
                {redirect}
            </div>
        )
    }
}

export default Navbar;