import React, { useState } from 'react';
import axios from 'axios';
import './Questions.css'; 
import { useNavigate } from 'react-router-dom';

const Questions = () => {
  
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']); // Initialize with empty strings
  const [correctOption, setCorrectOption] = useState(0); // Correct option index
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Retrieve data from localStorage
  const id = localStorage.getItem("uid") || '';
  const userid = localStorage.getItem("userId") || '';
  const qid = localStorage.getItem("tid") || '';
  const title = localStorage.getItem("qtitle") || '';

  // Handle change for question text
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  // Handle change for options
  const handleOptionChange = (index, e) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  // Handle change for correct option
  const handleCorrectOptionChange = (e) => {
    setCorrectOption(parseInt(e.target.value));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the form
    if (!question.trim()) {
      setError('Question text is required.');
      return;
    }
    if (options.some(option => option.trim() === '')) {
      setError('All options must be filled out.');
      return;
    }
    if (options.length !== 4) {
      setError('There must be exactly 4 options.');
      return;
    }
    if (correctOption < 0 || correctOption > 3) {
      setError('Correct option must be between 0 and 3.');
      return;
    }

    // Prepare the data to send to the server
    const data = {
      qid: qid,
      uid: id,
      userid: userid,
      title: title,
      text: question,
      options: options,
      correctOption: correctOption,
    };

    try {
       
        //alert("this is the answer we have");
        const response = await axios.post("https://quiz-web-application-1.onrender.com/StoreQuizQuestion", data, {
            headers: {
                'Content-Type': 'application/json', // Ensure correct content-type
            },
        });
        if (response.status === 201) {
            alert('Question added successfully!');
            console.log('Success:', response.data);  // Log the successful response data
            setQuestion('');
      setOptions(['', '', '', '']); // Reset options
      setCorrectOption(0); // Reset correct option
      setError(''); // Clear any previous errors
        } else {
            
            alert("Something went wrong! Please try again.");
            console.error('Unexpected response:', response.data);
        }
    } catch (error) {
        

        
        if (error.response) {
            
            alert(error.response.data.message || "Error during request, please try again.");
            console.error("Error response:", error.response.data);
        } else {
            
            alert("Error during request, please check your network connection.");
            console.error("Error without response:", error);
        }
    }
  };

  return (
    <div className="form-container">
      <h2>Add a Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="question">Question Text:</label>
          <input
            type="text"
            id="question"
            name="question"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Enter the question"
            required
          />
        </div>

        <div className="form-group">
          <label>Options:</label>
          {options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e)}
                placeholder={`Option ${index + 1}`}
                required
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="correctOption">Correct Option (0-3):</label>
          <input
            type="number"
            id="correctOption"
            name="correctOption"
            value={correctOption}
            onChange={handleCorrectOptionChange}
            min="0"
            max="3"
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit">Submit</button>\
        <button type="button" className="return-back-button" onClick={() => navigate('/QuizOptions')}>
              Return Back
        </button>
        

      </form>
    </div>
  );
};

export default Questions;
