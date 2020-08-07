import React, { Component } from 'react'
import axios from 'axios';
import './Highscore.css';

class Highscore extends Component {
    state = {
        rankings: [],
        userRanking: 0,
        loggedIn: false,
        loading: true,
        userId: "",
        userName: "",
        userScore: "",
        userTime: ""
    }

    componentDidMount() {
        this.checkLogin()
        this.getRankings();
    }

    checkLogin = async () => {
        await axios.get('/quiz')
        .then(res => {
            console.log(`User is logged in: ${res.data.loggedIn}`);
            console.log(res.data.userId);
            this.setState({
                loggedIn: res.data.loggedIn,
                loading: false,
                userId: res.data.userId,
                userName: res.data.userName,
                userScore: res.data.userScore,
                userTime: res.data.userTime

            });
        })
        .catch((error) => {
            console.log(error);
            console.log("There was an error")
        });
    }

    getRankings = async () => {
        // const userDetails = {
        //     _id: this.state.userId
        // } 
        const id = this.state.userId
        await axios.get('/leaderboard')
        .then(res => {
            console.log(res.data);
            this.setState({
                rankings: res.data,
                // userRanking: res.data.findIndex(i => i._id === {this.state.userId})
            }, () => {
                console.log(this.state.rankings);
                console.log(res.data.findIndex(i => i._id === {id}));

            });
        }).catch((error) => {
            console.log(error);
            console.log("There was an error");
        });

        // console.log(`Here is the leaderboard data ${res}`);
    };

    render() {
        
        return (
            <div>
                <h2 id="message"> Hi {this.state.userName}! </h2> 
                <div className="detailCont">
                    <h3 id="gDetails">Current score: {this.state.userScore} points!<br />Current Time: {this.state.userTime} seconds!</h3>
                </div>
            </div>
        )
    }
}

export default Highscore;
