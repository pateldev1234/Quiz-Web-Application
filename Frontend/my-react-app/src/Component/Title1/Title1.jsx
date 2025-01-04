import React, { useState } from 'react';
import axios from 'axios';
import './Title1.css'; 
import { useNavigate } from "react-router-dom";

const Title1 = () => {
  const [title, setTitle] = useState(''); // State to store the title
  const id = localStorage.getItem("uid") || '';
  const userid = localStorage.getItem("userId") || '';
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTitle(e.target.value); // Update the state with the value from input field
  };



  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (title.trim() === '') {
      alert('Title is required!');
      return;
    }

    try {
      // API call to store the quiz
       // alert(title);
       // alert(id);
       // alert(userid);
      const response = await axios.post("https://quiz-web-application-1.onrender.com/StoreQuiz", {
        title,
        id,
        userid,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        const { quiz } = response.data;
        console.log("Extracted Quiz Data:", quiz);

    // Store `quiz.title` and `quiz.userId` in localStorage
         if (quiz) {
          if (localStorage.getItem("qtitle") !== null) {
            // Update the value with the current quiz title
            localStorage.setItem("qtitle", quiz.title || "");
          } else {
            // Add the new key "qtitle" with the current quiz title
            localStorage.setItem("qtitle", quiz.title || "");
          }
        
          
          if (localStorage.getItem("tid") !== null) {
            
            localStorage.setItem("tid", quiz._id || "");
          } else {
            
            localStorage.setItem("tid", quiz._id || "");
          }
         

        
         alert("Start Adding the Quiz Question");
         /// alert(`Stored Quiz Title: ${quiz.title}`);
          //alert(`Stored Quiz ID: ${quiz._id}`);
          }
        setTitle(''); // Clear the form after successful submission
        navigate("/Questions");
      } else {
        alert(response.data.message || "Unexpected response from the server!");
      }
    } catch (error) {
      // Handle API errors
      if (error.response) {
        alert(error.response.data.message || "Error storing quiz title!");
      } else {
        alert("Network error. Please try again later.");
      }
      console.error("Error during API call:", error);
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
    </div>
  );
};

export default Title1;
