import React, {Component} from 'react';
import {NavLink, Redirect} from 'react-router-dom';

import {deleteNotification, getNotifications, readNotification} from '../../shared/Firebase';
import {handleError, handleSuccess} from '../../shared/ErrorHandling';

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifs: null
        }
    }

    componentDidMount = () => {
        if(this.props.currentUser) {
            this.getNotifs(this.props.currentUser.uid);

        }
    }

    async getNotifs(uid) {
        await getNotifications(uid).then(notifs => {
            this.setState({
                notifs
            })
        }).catch(err => {
            handleError(err);
        })
    }

    handleDelete = (e) => {
        e.preventDefault();

        deleteNotification(this.props.currentUser.uid, e.target.value).then(() => {
            this.getNotifs(this.props.currentUser.uid);
            handleSuccess();
        }).catch(err => {
            handleError(err);
        })
        
    }

    handleClick = (betID) => {
        readNotification(this.props.currentUser.uid, betID).catch(err=>{
            handleError(err);
        })
    }

    render() {
        if(!this.props.currentUser) return <Redirect to="/" />

        var notifs = this.state.notifs ? (
            <div className="section">
                {
                    Object.keys(this.state.notifs).map(keyName => {
                        var notif = this.state.notifs[keyName];
                        var newBadge = notif.read ? null : (
                            <span style={{marginLeft: "-5px", marginRight: "5px"}} className="new badge red left"></span>
                        )
                        notif.time = new Date(notif.time);
                        return (
                            <NavLink to={notif.path} onClick={()=>{this.handleClick(keyName)}}>
                                <div className="card-panel">
                                    <div className="row">
                                        <div className="col s12">
                                            {newBadge}
                                            <p>{notif.title}</p>
                                        </div>
                                        <div className="section col s12" style={{paddingTop: "5px", marginBottom: "-5px"}}>
                                            <p className="grey-text">{notif.message}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="divider"></div>
                                    <label htmlFor="timeSince">{notif.time.getMonth()+1}/{notif.time.getDate()}/{notif.time.getFullYear()}</label>
                                    <button className="btn right red z-depth-0" value={keyName} onClick={this.handleDelete}>delete</button>
                                    
                                </div>
                            </NavLink>
                        )
                    })
                }
            </div>
        ) : (
            <div className="section">
                <p className="center">No notifications!</p>
            </div>
        )

        return (
            <div className="container section">
                <div className="row">
                    <div className="col s12 m10 l8 offset-m1 offset-l2 card">
                        <div className="card-content">
                            <h4 className="center">Notifications</h4>
                            <div className="divider"></div>
                                
                            {notifs}

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Notifications;