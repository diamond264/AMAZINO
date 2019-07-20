import React, {Component} from 'react';

class AboutUs extends Component {
    render() {
        return(
            <div className="container section">
                <div className="card z-depth-1">
                    <div className="card-content">
                        <div className="row">
                            <div className="col s12 center">
                                <h4>About Us</h4>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="row">
                            <h5>The Team Behind Amazino</h5>
                            <p>Insert info about our team here</p>
                        </div>
                        <div className="row">
                            <h5>Contact Info</h5>
                            <p>Insert contact email if there are any bugs</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AboutUs;