import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import './Login.css';

export default class Login extends Component {
    state = {
        inputEmailAddress: "",
        inputPassword: "",
        message: "",
        loggedIn: false
    }

    recordEmail = (event) => {
        this.setState({
            inputEmailAddress: event.target.value
        })
    }

    recordPassword = (event) => {
        this.setState({
            inputPassword: event.target.value
        })
    }

    submitForm = async (event) => {
        event.preventDefault();
        console.log("Submitting form");
        // console.log(this.state.inputUsername);
        // console.log(this.state.inputEmailAddress);
        // console.log(this.state.inputPassword);
        this.loginUser();
    }

    loginUser = async () => {
        console.log("Attemping login");

        const userDetails = {
            email: this.state.inputEmailAddress,
            password: this.state.inputPassword
        }

        await axios.post("/login", userDetails)
        .then(res => {
            console.log(res.data.message)
            this.setState({
                loggedIn: res.data.loggedIn,
                message: res.data.message
            })
        })
        .catch((error) => {
            console.log(error)
            console.log("There was an error");
        });
    }

    componentDidMount() {
        this.checkLogin()
    }

    checkLogin = async () => {
        await axios.get('/quiz')
        .then(res => {
            console.log(`User is logged in: ${res.data.loggedIn}`);
            console.log(res.data.userId);
            this.setState({
                loggedIn: res.data.loggedIn
            });
        })
        .catch((error) => {
            console.log(error);
            console.log("There was an error")
        });
    }

    render() {
        if (this.state.loggedIn) {
            return <Redirect to="/quiz" />
        }
        return (
            <div className="login-flexbox">
                <div className="login-container">
                    <h1>Login</h1>
                    <form onSubmit={this.submitForm}>
                        <label className="login-label" htmlFor="userEmail">User email address:</label><br />
                        <input className="login-input" onChange={this.recordEmail} value={this.state.inputEmailAddress} type="email" placeholder="example@email.com" name="userEmail" /><br />
                        <label className="login-label" htmlFor="userPassword">Password:</label><br />
                        <input className="login-input" onChange={this.recordPassword} value={this.state.inputPassword} type="password" placeholder="" name="userPassword"/><br />
                        <button className="login-button" type="submit">Login</button>
                    </form>
                    {this.state.message === "Login unsuccessful" ? (<h4>{this.state.message}</h4>) : null}
                </div>
            </div>
        )
    }
}