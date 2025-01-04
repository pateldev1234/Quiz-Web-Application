import React from "react";
import { useNavigate } from "react-router-dom";
import "./QuizOptions.css";

const QuizOptions = () => {
  const navigate = useNavigate();
  const userid = localStorage.getItem("userId") || '';

  return (
    <div className="quiz-options-container">
      <h1 className="welcome-message">Welcome, {userid}!</h1>
      <h1 className="quiz-heading">
        There are Five options we have, and we have to choose one of them. Choose very carefully!
      </h1>
      <div className="buttons-container">
        <button className="btn createQuiz" onClick={() => navigate("/Title1")}>
          Create Quiz
        </button>
        <button className="btn getQuiz" onClick={() => navigate("/Title2")}>
          Get Quiz
        </button>
        <button className="btn userResult" onClick={() => navigate("/Title3")}>
          User Result
        </button>
        <button className="btn attemptQuiz" onClick={() => navigate("/Title4")}>
          Attempt Quiz
        </button>
        <button className="btn login" onClick={() => navigate("/")}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default QuizOptions;
