import {React,useState,useContext,useEffect} from 'react'
import {NavLink} from 'react-router-dom'
import "./Login.css"
import { useNavigate } from "react-router-dom";
import QuizOptions from '../QuizOptions/QuizOptions';
import axios from "axios";
import Title1 from '../Title1/Title1';

const Login = () => {
  const [user, setUser] = useState({
      userid: "",
      password: "",
  });

  // input changes
  useEffect(() => {
      console.log("User state updated:", user);
  }, [user]);

  const navigate =  useNavigate();
  // Handle input changes
  const handleChange = (e) => {
      const { name, value } = e.target;
      setUser((prevState) => ({
          ...prevState,
          [name]: value,
      }));
  };


  const userData = {
    userid: user.userid,
    password: user.password // Assuming the API uses "cpassword" for confirmation
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/login", userData, {
          headers: {
              'Content-Type': 'application/json', // Ensure correct content-type
          },
      });

      // alert(response.status);
      // Check for the response
      if (response.status === 201) {
          // Successful signup
          const { user } = response.data;
        //   alert(user.userid);
        //   alert(user.id);
          localStorage.setItem("userId", user.userid);
          localStorage.setItem("uid", user.id);
          alert("login successful!");
          navigate("/QuizOptions");
          //navigate("/Title");
      } else {
          // If something is wrong or unexpected status
          alert("jhello");
          alert(response.data.message || "Unexpected response status!");
      }

  } catch (error) {
      
      if (error.response) {
          
          alert(error.response.data.message || "Error signing up, please try again.");
      } else {
          
          alert("Error during signup, please check your network connection.");
      }
      console.error("Error during signup:", error);
  }
      
      
  };

  return (
      <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
              <div>
                  <label htmlFor="userid">User ID:</label>
                  <input
                      type="text"
                      id="userid"
                      name="userid"
                      value={user.userid}
                      onChange={handleChange}
                      placeholder="Enter your User ID"
                      required
                  />
              </div>
              <div>
                  <label htmlFor="password">Password:</label>
                  <input
                      type="password"
                      id="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      placeholder="Enter your Password"
                      required
                  />
              </div>
              <button type="submit">Submit</button>
          </form>
          <p>
              Don't have an account? <a href="/signup">Sign up here</a>
          </p>
      </div>
  );
};

export default Login;

