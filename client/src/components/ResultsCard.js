import React from 'react'

export default function ResultsCard(props) {
    return (
        <div>
            <h1>You scored {props.score}/10 in {props.time} seconds</h1>

            <form>
                <button onClick={props.submitToLeaderboardFunc}>Submit to Leaderboard!!</button>
            </form>
        </div>
    )
}
