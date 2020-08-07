import React from 'react';
import './QCard.css';


export default function QCard(props) {
    return (
        <div className={props.className}>
            <div className="qcard">
                <h2 id="qText">Question {props.qNo}</h2>
                <h2>{props.text}</h2>
                <form name={props.qNo} onSubmit={props.formSubmitFunc}>
                    <div className="option">
                        <label className="btnStyle" htmlFor="answer1" >
                            <input
                                type="radio" 
                                id="answer1" 
                                name={props.qNo}
                                value={props.answer1}
                                onChange={props.onValueChangeFunc}
                            />
                            {props.answer1}
                        </label>
                    </div>
                    <div className="option">
                        <label className="btnStyle" htmlFor="answer2" >
                            <input 
                                type="radio" 
                                id="answer2" 
                                name={props.qNo}
                                value={props.answer2}
                                onChange={props.onValueChangeFunc}
                            />
                            {props.answer2}
                        </label>
                    </div>
                    <div className="option">
                        <label className="btnStyle" htmlFor="answer3" >
                            <input 
                                type="radio" 
                                id="answer3" 
                                name={props.qNo} 
                                value={props.answer3}
                                onChange={props.onValueChangeFunc} 
                            />
                            {props.answer3}
                        </label>
                    </div>
                    <div className="option">
                        <label className="btnStyle" htmlFor="answer4" >
                            <input 
                                type="radio" 
                                id="answer4" 
                                name={props.qNo} 
                                value={props.answer4}
                                onChange={props.onValueChangeFunc} 
                            />
                            {props.answer4}
                        </label>
                    </div>
                    <br />
                    <br />
                    <button className="qcard-button" type="submit">{props.submitBtnText}</button>
                </form>
            </div>
        </div>
    )
}
