import React from 'react'

export default function ResultsCard(props) {
    return (
        <div>
            <h1>Your score is {props.score}/10</h1>

            <form>
                <button>Submit to Leaderboard!!</button>
            </form>
        </div>
    )
}
