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
                            <p>
                                We are UCSC students who created this project for our Intro to Software Engineering
                                Course. This project stemmed from an idea that people want expensive items for cheap.
                                We decided to make this idea into a game of chance in which everybody is satisfied.
                                Sellers can sell items just like any other e-commerce site but buyers can save money
                                by gambling.
                            </p>
                        </div>
                        <div className="row">
                            <h5>Contact Info</h5>
                            <p>yma71@ucsc.edu</p>
                            <p>mnikaido@ucsc.edu</p>
                            <p>rsteinwe@ucsc.edu</p>
                            <p>jmoon15@ucsc.edu</p>
                            <p>hyjyoon@ucsc.edu</p>
                            <p>
                                Please contact any of these email addresses for any questions,
                                comments, concerns or bugs.
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AboutUs;