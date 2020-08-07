import React, { Component } from 'react'
import axios from 'axios';
import './Leaderboard.css';

class Leaderboard extends Component {
    state = {
        topTen: []
    }
    getTopTen = async () => {
        // const res = 
        await axios.get('/leaderboard')
        .then(res => {
            console.log(res.data);
            this.setState({
                topTen: res.data.slice(0, 10)
            }, () => {
                console.log(this.state.topTen);
            });
        }).catch((error) => {
            console.log(error);
            console.log("There was an error");
        });

        // console.log(`Here is the leaderboard data ${res}`);
    };

    componentDidMount() {
        this.getTopTen();
    }

    render() {
        let userListItems = this.state.topTen.length > 0 && this.state.topTen.map((user, index) => {
        return ( 
            // <div className="leaderboard-row">

            // </div> key={index}>{user.name} got a score of {user.score} in {user.time} seconds</li> )

            <div className="row">
                <div className="column _20 centered">
                    <p>{index+1}</p>
                </div>
                <div className="column _40">
                    <p>{user.name}</p>
                </div>
                <div className="column _20 centered">
                    <p>{user.score}</p>
                </div>
                <div className="column _20 centered">
                    <p>{user.time}</p>
                </div>
            </div>
        )
        })
        return (
            <div>

                {/* <ol>
                    {userListItems}
                </ol> */}

                <div className="leaderboard-flexbox">
                    <div className="header">
                        <div className="column _20 centered">
                            <p>Ranking</p>
                        </div>
                        <div className="column _40">
                            <p>Username</p>
                        </div>
                        <div className="column _20 centered">
                            <p>Score</p>
                        </div>
                        <div className="column _20 centered">
                            <p>Time</p>
                        </div>
                    </div>
                    {userListItems}
                </div>
            </div>
        )
    }
}
export default Leaderboard;
