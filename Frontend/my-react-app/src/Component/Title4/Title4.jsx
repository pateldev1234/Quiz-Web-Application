
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Title4.css'; // Importing the CSS file
import { useNavigate } from 'react-router-dom';

const Title4 = () => {
  const [title, setTitle] = useState(''); // State to store the title
  const [questions, setQuestions] = useState([]); // State to store the questions array
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  const [selectedOptions, setSelectedOptions] = useState([]); // Store selected options
  const [answerStatus, setAnswerStatus] = useState([]); // Store answer status (correct/incorrect)
  const [error, setError] = useState(''); // Error handling state
  const id = localStorage.getItem("uid") || '';
  const userid = localStorage.getItem("userId") || '';
  const qid = localStorage.getItem("tid") || '';
  const title1 = localStorage.getItem("qtitle") || '';
// const quizTitle = title; // Replace this with the actual quiz title you're fetching
// const titleKey = `qtitle${quizTitle}`;
// const idKey = `tid${quizTitle}`;

    const navigate = useNavigate();



  const handleChange = (e) => {
    setTitle(e.target.value); // Update the state with the value from input field
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Reset previous questions and error before making a new request
    setQuestions([]);
    setError('');

    if (title.trim() === '') {
      alert('Title is required!');
      return;
    }

    try {
      const response = await axios.get('http://localhost:8000/GetQuizQuestion', {
        params: {
          uid: id,
          userid,
          title,
        },
      });
      console.log(response);
      // Check if there are questions in the response
      // if (response.data && response.data.question && response.data.question.length > 0) {
      //   setQuestions(response.data.question); // Set the questions state
      // } else if (response.status === 400 || !response.data.result) {
        
      //   alert(response.data.message || "Quiz result not found.");
      // } else {
        
      //   alert("Unexpected error occurred. Please try again later.");
      // }

      // alert('Quiz question retrieved successfully!');

      if (response.data && response.data.question && response.data.question.length > 0) {
        setQuestions(response.data.question); // Set the questions state
        alert('Quiz question retrieved successfully!');
      } else if (response.status === 400) {
        // Display the error message from the server as an alert
        alert(response.data.message || "Quiz result not found.");
      } else {
        alert("Unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      // console.error('Error fetching quiz question:', error);
      // setError('Failed to fetch quiz question. Please try again.');
      const errorMessage =
    error.response?.data?.message || "Failed to fetch quiz question. Please try again.";
  alert(errorMessage);

  setError(errorMessage);
    }
  };

  const handleOptionSelect = (questionIndex, optionIndex) => {
    // Update the selected option for the current question
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[questionIndex] = optionIndex;
    setSelectedOptions(updatedSelectedOptions);
  };

  const handleSubmitAnswer = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOptionIndex = selectedOptions[currentQuestionIndex];
    const selectedOption = currentQuestion.options[selectedOptionIndex];

    try {
        //alert("this is the error we have");
        console.log({
            qid,
            uid: id,
            userid,
            title,
            text: currentQuestion.text,
          });
        const response = await axios.get('http://localhost:8000/getanswer', {
        params: {
          qid,
          uid: id,
          userid,
          title,
          text: currentQuestion.text,
        },
      });

      //alert("This is the error2 we have");
      const correctOptionIndex = currentQuestion.correctOption;
      const isCorrect = selectedOptionIndex === correctOptionIndex ? 1 : 0;

      console.log(isCorrect);

      // Call the API to submit the answer
      await axios.post('http://localhost:8000/submitanswer', {
        qid,
        uid: id,
        userid,
        title,
        text: currentQuestion.text,
        option: selectedOptionIndex,
        iscorrect: isCorrect,
      });

      console.log("this is the quiz that i have made successfully");
      // Update answer status to display correct/incorrect feedback
      const updatedAnswerStatus = [...answerStatus];
      updatedAnswerStatus[currentQuestionIndex] = isCorrect;
      setAnswerStatus(updatedAnswerStatus);

      alert(`Question submitted! Your answer is ${isCorrect ? "correct" : "incorrect"}`);
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer.');
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinalSubmit = async () => {
    ///alert("enter");
    try {
        // Send POST request to your server
        //alert("entering to final submit button");
        //console.log(title1);
        console.log(title);
        const response = await axios.post('http://localhost:8000/finalsubmit', {
            qid,
            uid: id,
            userid,
            title
        });

        // Handle the success response
        console.log('Quiz Submitted:', response.data);
        
        // Alert message for successful submission
        alert("Quiz Submitted!");
        navigate("/QuizOptions");
        

    } catch (error) {
        console.error('Error submitting quiz:', error);
        alert("An error occurred while submitting the quiz.");
    }
  };

  return (
    <div className="quiz-container">
      {questions.length > 0 ? (
        <div className="quiz">
          <h3>{title}</h3>
          <div className="question-container">
            <div className="question">
              <p><strong>Question {currentQuestionIndex + 1}:</strong> {questions[currentQuestionIndex].text}</p>
              <ul>
                {questions[currentQuestionIndex].options.map((option, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleOptionSelect(currentQuestionIndex, idx)}
                    className={
                      selectedOptions[currentQuestionIndex] === idx
                        ? answerStatus[currentQuestionIndex] === 1
                          ? "selected correct"
                          : "selected incorrect"
                        : ""
                    }
                  >
                    {option}
                  </li>
                ))}
              </ul>
              <button className="submit-button" onClick={handleSubmitAnswer}>Submit</button>
            </div>
            <div className="navigation-buttons">
              <button className="prev-button" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                Previous
              </button>
              {currentQuestionIndex === questions.length - 1 ? (
                <button className="final-submit-button" onClick={handleFinalSubmit}>
                  Final Submit
                </button>
              ) : (
                <button className="next-button" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="title-container">
          <h2>Enter Title</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={handleChange}
                placeholder="Enter your title"
                required
              />
            </div>
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Title4;




