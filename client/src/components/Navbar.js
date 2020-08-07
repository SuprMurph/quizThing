import React from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import './Navbar.css';


export default function Navbar() {

    const logoutFunc = async () => {
        console.log("Attempting logout")
        await Axios.get("/logout")
        .then(res => {
            console.log(res.data)
        })
        .catch(error => {
            console.log(error);
            console.log("there was an erro");
        })
    }

    

    return (
        <div>
            <nav>
                <Link to = "/">Home</Link>
                <Link to = "/login">Login</Link>
                <Link to = "/register">Register</Link>
                <Link to = "/quiz">Quiz</Link>
                {/* <Link to = "/leaderboard">Leaderboard</Link> */}
                <Link id="logout-link" to = "/logout" onClick={logoutFunc}>logout</Link>
                
            </nav>
        </div>
    )
}
