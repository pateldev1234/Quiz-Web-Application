import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Signup = () => {
    const [user, setUser] = useState({
        userid: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (user.password !== user.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Prepare the data for the request
        const userData = {
            userid: user.userid,
            name: user.name,
            email: user.email,
            password: user.password,
            cpassword: user.confirmPassword, 
        };
        
       
        try {
            const response = await axios.post("https://quiz-web-application-1.onrender.com/signup", userData, {
                headers: {
                    'Content-Type': 'application/json', 
                },
            });
    
            // Check for specific status and messages from the response
            if (response.status === 201) {
                // Successful signup
                alert("Signup successful!");
                navigate("/"); // Redirect to the home page
            } else {
                // If something is wrong or unexpected status
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
        <div className="signup-container">
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
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

                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        placeholder="Enter your Name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Enter your Email"
                        required
                    />
                </div>

                <div className="form-group">
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

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={user.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your Password"
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
