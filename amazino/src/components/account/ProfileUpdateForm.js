import React, {Component} from 'react';

import {updateProfileInfo} from '../../shared/Firebase';
import {handleError, handleSuccess} from '../../shared/ErrorHandling';

class ProfileUpdateForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bio: props.user.bio,
            uid: props.uid
        }
    }

    handleProfileUpdate = (e) => {
        e.preventDefault();

        // Update profile info with state information
        updateProfileInfo(this.state.uid, this.state.bio).then(() => {
            this.props.hideProfileUpdateForm();
            handleSuccess();
        }).catch(err => {
            handleError(err);
        });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render() {
        return(
            <div className="col s12">
                <div className="row">
                    <form action="submit" onSubmit={this.handleProfileUpdate}>
                        <div className="col s12" style={{paddingTop: "25px"}}>
                            <label htmlFor="bio">Bio</label>
                            <input defaultValue={this.state.bio} onChange={this.handleChange} style={{paddingBottom: "15px"}} 
                                type="text" className="materialize-textarea" id="bio"/>
                        </div>
                        <div className="col s12">
                            <button className="btn green" style={{marginRight: "5px"}}>update bio</button>
                            <button className="btn red" onClick={this.props.hideProfileUpdateForm}>cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default ProfileUpdateForm