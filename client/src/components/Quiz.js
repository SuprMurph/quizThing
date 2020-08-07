import React, { Component } from 'react'
import './App.css';
import axios from 'axios';
import QCard from './QCard';
import ResultsCard from './ResultsCard';
import QuizSelection from './QuizSelection';
import { Redirect } from 'react-router-dom';
import './Quiz.css';

class Quiz extends Component {
    state = {
        quizSelected: false,
        quizData: [],
        questionsAnswered: 0,
        correctAnswerCount: 0,
        randomAnswers: [],
        userAnswer: null,
        category: 9,
        difficulty: "easy",
        seconds: 0,
        message: "",
        loggedIn: false,
        loading: true,
        userId: "",
        userName: "",
        resultsSubmitted: false,
        visibleQcard: ["true", "false", "false", "false", "false", "false", "false", "false", "false", "false"]
    }

    // Choosing category and difficulty

    selectCategory = (event) => {
        console.log(event.target.value);
        this.setState({
            category: event.target.value
        })
    }

    selectDifficulty = (event) => {
        console.log(event.target.value);
        this.setState({
            difficulty: event.target.value
        })
    }

    selectQuiz = (event) => {
        event.preventDefault();
        this.getApi();
        this.startTimer();
    }

    // Timer functions

    startTimer = () => {
        console.log("Starting timer");
        this.myInterval = setInterval(() => {
            this.setState(prevState => ({
                seconds: prevState.seconds + 1
            }))
            // console.log(this.state.count)
        }, 1000)
    }

    stopTimer = () => {
        clearInterval(this.myInterval)
    }

    // Saving answers from API to randomAnswers

    // Shuffling answers

    shuffle = (array) => {
        console.log('Shuffling array');
        for (let i = 0; i < 1000; i++) {
          let location1 = Math.floor((Math.random()*array.length));
          let location2 = Math.floor((Math.random()*array.length));
          let tmp = array[location1];
          array[location1] = array[location2];
          array[location2] = tmp;
        }
    };
    
    saveAnswers = (index) => {
        if (this.state.quizData.length > 0) {
            console.log('Quiz Data exists');
            const shuffledAnswers = this.state.quizData.map((quizDatum) => {

                console.log("Extracting questions");
                
                let correctAnswer = [quizDatum.correct_answer];
                let incorrectAnswers = quizDatum.incorrect_answers;
                let allAnswers = correctAnswer.concat(incorrectAnswers);

                console.log(`Here is the unshuffled array: ${allAnswers}`);
                console.log(typeof allAnswers);
                console.log(allAnswers);
                this.shuffle(allAnswers);
                console.log(`Here is the shuffled array: ${allAnswers}`);

                return allAnswers;
            });
            console.log(shuffledAnswers);
            this.setState({
                randomAnswers: shuffledAnswers
            });
        } else {
            console.log('Quiz data does not exist');
        }
    }

    // Calling API

    getApi = async () => {
        let category = this.state.category;
        let difficulty = this.state.difficulty;

        const res = await axios.get(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`);
        console.log(`Here is the quizData: ${res.data}`);
        this.setState({
            quizData: res.data.results,
            quizSelected: true
        }, () => {
            console.log(`Here is the loaded quiz data: ${this.state.quizData}`);
            this.saveAnswers();
        });
    };

    componentDidMount() {
        this.checkLogin()
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
                userName: res.data.userName
            });
        })
        .catch((error) => {
            console.log(error);
            console.log("There was an error")
        });
    }

    // Radio button form functions

    // Checking if correct answer

    checkAnswer = (inputAnswer, correctAnswer) => {
        console.log(`The user chose ${inputAnswer} and the correct answer was ${correctAnswer}`);
        if (inputAnswer === correctAnswer && this.state.correctAnswerCount < 10) {
            console.log("Correct answer chosen");
            this.setState({
                correctAnswerCount: this.state.correctAnswerCount + 1
            }, () => {
                console.log(`Correct answers so far: ${this.state.correctAnswerCount}`);
            })
        } else {
            console.log("Incorrect answer chosen");

        }
    }

    // Selecting option

    onValueChange = (event) => {
        console.log(event.target.value);
        this.setState({
            userAnswer: event.target.value
        });
    }

    // Submitting option

    formSubmit = (event) => {
        event.preventDefault();
        let visibleQcard = [...this.state.visibleQcard];
        let nextIndex = parseInt(event.target.name);

        console.log(visibleQcard);

        visibleQcard[event.target.name-1] = "false";
        visibleQcard[nextIndex] = "true;"

        console.log(visibleQcard);
        


        let nextCard = this.state.visibleQcard[nextIndex];

        console.log(nextIndex);
        console.log(nextCard);

        console.log(this.state.userAnswer);
        console.log(`This is the question number: ${event.target.name}`);
        this.checkAnswer(this.state.userAnswer, this.state.quizData[event.target.name-1].correct_answer);
        this.setState({
            questionsAnswered: this.state.questionsAnswered < 10 ? this.state.questionsAnswered + 1 : 10,
            visibleQcard: visibleQcard

        }, () => {
            console.log(`Questions answered: ${this.state.questionsAnswered}/10`);
            if (this.state.questionsAnswered === 10) {
                this.stopTimer();
            }
        });
    }

    submitToLeaderboard = async (event) => {
        event.preventDefault();
        const scoreTimeId = {
            score: this.state.correctAnswerCount,
            time: this.state.seconds,
            _id: this.state.userId,
        }
        await axios.post('/results', scoreTimeId)
            .then(res => {
                console.log(res.data.message);
                this.setState({
                    message: res.data.message,
                    resultsSubmitted: res.data.resultsSubmitted
                });
            }).catch((error) => {
                console.log(error)
                console.log("There was an error");
            });
        this.setState({ 
            correctAnswerCount: '', 
            questionsAnswered: ''
        })
    }
    render() {
        let displayCards = this.state.quizData.length > 0 && this.state.quizData.map( (quizDatum, index) => {
            if (index === 0) {
                return (
                    <QCard 
                    className={this.state.visibleQcard[index]}
                    key={index} 
                    qNo={index+1} 
                    text={quizDatum.question}
                    answer1={this.state.randomAnswers && this.state.randomAnswers[index] && this.state.randomAnswers[index][0]}
                    answer2={this.state.randomAnswers && this.state.randomAnswers[index] && this.state.randomAnswers[index][1]}
                    answer3={this.state.randomAnswers && this.state.randomAnswers[index] && this.state.randomAnswers[index][2]}
                    answer4={this.state.randomAnswers && this.state.randomAnswers[index] && this.state.randomAnswers[index][3]}
                    formSubmitFunc={this.formSubmit} 
                    onValueChangeFunc={this.onValueChange}
                    submitBtnText="Next Question"
                    />
                )
            } else if (index > 0 && index < 9){
                return (
                    <QCard
                    className={this.state.visibleQcard[index]}
                    key={index} 
                    qNo={index+1} 
                    text={quizDatum.question}
                    answer1={this.state.randomAnswers && this.state.randomAnswers[index] && this.state.randomAnswers[index][0]}
                    answer2={this.state.randomAnswers && this.state.randomAnswers[index] && this.state.randomAnswers[index][1]}
                    answer3={this.state.randomAnswers && this.state.randomAnswers[index] && this.state.randomAnswers[index][2]}
                    answer4={this.state.randomAnswers && this.state.randomAnswers[index] && this.state.randomAnswers[index][3]}
                    formSubmitFunc={this.formSubmit} 
                    onValueChangeFunc={this.onValueChange}
                    submitBtnText="Next Question"
                    />
                )
            } else if (index === 9) {
                return (
                    <QCard
                    className={this.state.visibleQcard[index]}
                    key={index} 
                    qNo={index+1} 
                    text={quizDatum.question}
                    answer1={this.state.randomAnswers && this.state.randomAnswers[index] && this.state.randomAnswers[index][0]}
                    answer2={this.state.randomAnswers && this.state.randomAnswers[index] && this.state.randomAnswers[index][1]}
                    answer3={this.state.randomAnswers && this.state.randomAnswers[index] && this.state.randomAnswers[index][2]}
                    answer4={this.state.randomAnswers && this.state.randomAnswers[index] && this.state.randomAnswers[index][3]}
                    formSubmitFunc={this.formSubmit} 
                    onValueChangeFunc={this.onValueChange}
                    submitBtnText="End Quiz"
                    />
                )
            };
        });

        if (!this.state.loading && !this.state.loggedIn) {
            return <Redirect to="/login" />
        }
        if (this.state.resultsSubmitted) {
            return <Redirect to="/leaderboard" />
        }
            return (
                <React.Fragment>
                  
                  <div className="quiz-body">
                    { this.state.quizSelected ? (
                        <div className="timerBox">
                            <p id="timer">Timer: {this.state.seconds} </p> 
                        </div>
                    ) : null }
                    {/* <h1 className="welcome-text">Welcome to the quiz, {this.state.userName}!!</h1>
                    { !this.state.loggedIn && <h1>You are not logged in</h1>}
                    { !this.state.quizSelected && this.state.loggedIn ? (
                        <QuizSelection selectCategoryFunc={this.selectCategory} selectDifficultyFunc={this.selectDifficulty} selectQuizFunc={this.selectQuiz} />
                    ) : null } */}
                
                    

                    <h1 id="greeting">Welcome to the quiz, {this.state.userName}!!</h1>
                    { !this.state.loggedIn && <h1>You are not logged in</h1>}
                    { !this.state.quizSelected && this.state.loggedIn ? (
                        <QuizSelection selectCategoryFunc={this.selectCategory} selectDifficultyFunc={this.selectDifficulty} selectQuizFunc={this.selectQuiz} />
                    ) : null }
                    { this.state.quizSelected && this.state.questionsAnswered >= 0 ? displayCards : null}
                    { this.state.questionsAnswered >= 10 ? (
                        <ResultsCard submitToLeaderboardFunc={this.submitToLeaderboard} score={this.state.correctAnswerCount} time={this.state.seconds}/>
                    ) : (
                        null
                    )}
                    <h4>{this.state.message}</h4>
                </div>
            </React.Fragment>
        )
    }
}
export default Quiz;
