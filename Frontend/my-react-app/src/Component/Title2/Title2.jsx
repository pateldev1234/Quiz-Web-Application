import React, { useState } from 'react';
import axios from 'axios';
import './Title2.css'; 

const Title2 = () => {
  const [title, setTitle] = useState(''); // State to store the title
  const [questions, setQuestions] = useState([]); // State to store the questions array
  const [error, setError] = useState(''); // Error handling state
  const id = localStorage.getItem("uid") || '';
  const userid = localStorage.getItem("userId") || '';

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
      if (response.data && response.data.question && response.data.question.length > 0) {
        setQuestions(response.data.question); // Set the questions state
      } else if(response.status === 404){
        setError('No questions found for this quiz.');
      }

      alert('Quiz question retrieved successfully!');
    } catch (error) {
      // console.error('Error fetching quiz question:', error);
      // setError('No Quiz Exists with this title');
      const errorMessage =
    error.response?.data?.message || "Failed to fetch quiz question. Please try again.";
  alert(errorMessage);

  setError(errorMessage);
    }
  };

  return (
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

      {/* Render questions if available */}
      <div className="questions-container">
        {error && <p className="error">{error}</p>}
        {questions.length > 0 && (
          <div>
            <h3>Questions:</h3>
            <div className="questions-list">
              {questions.map((question, index) => (
                <div key={question._id} className="question-item">
                  <p><strong>Question {index + 1}: </strong>{question.text}</p>
                  <ul>
                    {question.options.map((option, idx) => (
                      <li key={idx}>{option}</li>
                    ))}
                  </ul>
                  <p><strong>Correct Option: </strong>{question.options[question.correctOption]}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Title2;


