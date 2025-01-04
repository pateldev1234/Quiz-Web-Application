// import React, { useState } from "react";
// import axios from "axios";
// import "./Title3.css";

// const Title3 = () => {
//   const [title, setTitle] = useState("");
//   const [result, setResult] = useState(null);
//   const [details, setDetails] = useState(null);
//   const id = localStorage.getItem("uid") || "";
//   const userid = localStorage.getItem("userId") || "";
//   const qid = localStorage.getItem("tid") || "";

//   const handleChange = (e) => {
//     setTitle(e.target.value);
//   };

//   const fetchAdditionalDetails = async (qid, uid, result1) => {
//     try {
//       const quizResponse = await axios.get("http://localhost:8000/getquizbyId", {
//         params: { qid },
//       });
//       const userResponse = await axios.get(
//         "http://localhost:8000/getuserbyId",
//         { params: { uid } }
//       );

//       const questionResponses = await Promise.all(
//         result1.questions.map((question) =>
//           axios.get("http://localhost:8000/getquestionbyId", {
//             params: { qid: question.question_id },
//           })
//         )
//       );

//       const answerResponses = await Promise.all(
//         result1.questions.map((question) =>
//           axios.get("http://localhost:8000/getanswerbyId", {
//             params: { qid: question.question_id },
//           })
//         )
//       );

//       const questions = questionResponses.map((res, index) => {
//         const { text, options, correctOption } = res.data.data;
//         const { selected_option, is_correct } = answerResponses[index].data.data;

//         return {
//           text,
//           options,
//           correctOptionText: options[correctOption],
//           selectedOptionText: options[selected_option],
//           isCorrect: is_correct,
//         };
//       });

//       setDetails({
//         quiz: quizResponse.data.data,
//         user: userResponse.data.data,
//         questions,
//       });
//     } catch (error) {
//       console.error("Error fetching additional details:", error);
//       alert("Failed to fetch additional details. Please try again.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (title.trim() === "") {
//       alert("Title is required!");
//       return;
//     }

//     // try {
//     //   const response = await axios.get("http://localhost:8000/finalresult", {
//     //     params: {
//     //       qid,
//     //       uid: id,
//     //       userid,
//     //       title,
//     //     },
//     //   });
//     //   //console.log(response.status);
//     //   //console.log(response);
//     //   console.log(response);
//     //   if (response.status === 201) {
//     //     alert("Successfully fetched the scores");
//     //     setResult(response.data.result);

//     //     await fetchAdditionalDetails(
//     //       response.data.result.quiz_id,
//     //       response.data.result.user_id,
//     //       response.data.result
//     //     );
//     //   }
//     //   else if (response.status === 400){

//     //     alert(response.data.message || "Quiz Result Not Exists");
//     //   }
//     // } catch (error) {
//     //   console.error("Error fetching final result:", error);
//     //   alert("An unexpected error occurred. Please try again later.");
//     // }
//     try {
//       const response = await axios.get("http://localhost:8000/finalresult", {
//         params: {
//           qid,
//           uid: id,
//           userid,
//           title,
//         },
//       });
    
//       console.log(response); // For debugging purposes, you can remove this later
    
//       // Check if the response status is 200 or if there's data
//       if (response.status === 201 && response.data.result) {
//         alert("Successfully fetched the scores");
//         setResult(response.data.result);
    
//         // Fetch additional details if the result is present
//         await fetchAdditionalDetails(
//           response.data.result.quiz_id,
//           response.data.result.user_id,
//           response.data.result
//         );
//       } else if (response.status === 400 || !response.data.result) {
        
//         alert(response.data.message || "Quiz result not found.");
//       } else {
        
//         alert("Unexpected error occurred. Please try again later.");
//       }
//     } catch (error) {
    
//       console.error("Error fetching final result:", error);
      
     
//       if (error.response) {
//         alert(error.response.data.message || "Error during request, please try again.");
//         console.error("Error response:", error.response.data);
//       } else {
//         // Handle cases like network issues or no response
//         alert("Error during request, please check your network connection.");
//         console.error("Error without response:", error);
//       }
//     }
//   };

//   return (
//     <div className="title-container">
//       {!result ? (
//         <div className="form-wrapper">
//           <h2>Enter Title</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label htmlFor="title">Title:</label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={title}
//                 onChange={handleChange}
//                 placeholder="Enter your title"
//                 required
//               />
//             </div>
//             <button type="submit" className="submit-button">
//               Submit
//             </button>
//           </form>
//         </div>
//       ) : (
//         <div className="result-container">
//           <h2>Final Result</h2>
//           <h2>
//             <strong>Score:</strong> {result.score}
//           </h2>
//           {/* <p>
//             <strong>Quiz ID:</strong> {result.quiz_id}
//           </p>
//           <p>
//             <strong>User ID:</strong> {result.user_id}
//           </p> */}

//           {details && (
//             <>
//               <h2>Quiz Details</h2>
//               <h3>
//                 <strong>Quiz Name:</strong> {details.quiz.title}
//               </h3>
//               <h3>
//                 <strong>Username:</strong> {details.user.name}
//               </h3>
//               <h3>Questions:</h3>
//               <div className="table-wrapper">
//                 <table className="questions-table">
//                   <thead>
//                     <tr>
//                       <th>Question</th>
//                       <th>Options</th>
//                       <th>Correct Option</th>
//                       <th>Selected Option</th>
//                       <th>Correct?</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {details.questions.map((question, index) => (
//                       <tr key={index}>
//                         <td>{question.text}</td>
//                         <td>{question.options.join(", ")}</td>
//                         <td>{question.correctOptionText}</td>
//                         <td>{question.selectedOptionText}</td>
//                         <td>{question.isCorrect ? "Yes" : "No"}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

//  export default Title3;
import React, { useState } from "react";
import axios from "axios";
import "./Title3.css";

const Title3 = () => {
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(null);
  const [details, setDetails] = useState(null);
  const id = localStorage.getItem("uid") || "";
  const userid = localStorage.getItem("userId") || "";
  const qid = localStorage.getItem("tid") || "";
  const [computedResults, setComputedResults] = useState(null);

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const fetchAdditionalDetails = async (qid, uid, result1) => {
    try {
      const quizResponse = await axios.get("http://localhost:8000/getquizbyId", {
        params: { qid },
      });
      const userResponse = await axios.get(
        "http://localhost:8000/getuserbyId",
        { params: { uid } }
      );

      const questionResponses = await Promise.all(
        result1.questions.map((question) =>
          axios.get("http://localhost:8000/getquestionbyId", {
            params: { qid: question.question_id },
          })
        )
      );

      const answerResponses = await Promise.all(
        result1.questions.map((question) =>
          axios.get("http://localhost:8000/getanswerbyId", {
            params: { qid: question.question_id },
          })
        )
      );

      const questions = questionResponses.map((res, index) => {
        const { text, options, correctOption } = res.data.data;
        const { selected_option, is_correct } = answerResponses[index].data.data;

        return {
          text,
          options,
          correctOptionText: options[correctOption],
          selectedOptionText: options[selected_option],
          isCorrect: is_correct,
        };
      });

      setDetails({
        quiz: quizResponse.data.data,
        user: userResponse.data.data,
        questions,
      });
    } catch (error) {
      console.error("Error fetching additional details:", error);
      alert("Failed to fetch additional details. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === "") {
      alert("Title is required!");
      return;
    }

    // try {
    //   const response = await axios.get("http://localhost:8000/finalresult", {
    //     params: {
    //       qid,
    //       uid: id,
    //       userid,
    //       title,
    //     },
    //   });
    //   //console.log(response.status);
    //   //console.log(response);
    //   console.log(response);
    //   if (response.status === 201) {
    //     alert("Successfully fetched the scores");
    //     setResult(response.data.result);

    //     await fetchAdditionalDetails(
    //       response.data.result.quiz_id,
    //       response.data.result.user_id,
    //       response.data.result
    //     );
    //   }
    //   else if (response.status === 400){

    //     alert(response.data.message || "Quiz Result Not Exists");
    //   }
    // } catch (error) {
    //   console.error("Error fetching final result:", error);
    //   alert("An unexpected error occurred. Please try again later.");
    // }
    try {
      const response = await axios.get("http://localhost:8000/finalresult", {
        params: {
          qid,
          uid: id,
          userid,
          title,
        },
      });
    
      console.log(response); // For debugging purposes, you can remove this later
    
      // Check if the response status is 200 or if there's data
      if (response.status === 201 && response.data.result) {
        alert("Successfully fetched the scores");
        setResult(response.data.result);

        const totalQuestions = response.data.result.questions.length;


  setComputedResults({ totalQuestions });
    
        // Fetch additional details if the result is present
        await fetchAdditionalDetails(
          response.data.result.quiz_id,
          response.data.result.user_id,
          response.data.result
        );
      } else if (response.status === 400 || !response.data.result) {
        
        alert(response.data.message || "Quiz result not found.");
      } else {
        
        alert("Unexpected error occurred. Please try again later.");
      }
    } catch (error) {
    
      console.error("Error fetching final result:", error);
      
     
      if (error.response) {
        alert(error.response.data.message || "Error during request, please try again.");
        console.error("Error response:", error.response.data);
      } else {
        // Handle cases like network issues or no response
        alert("Error during request, please check your network connection.");
        console.error("Error without response:", error);
      }
    }
  };

  return (
    <div className="title-container">
      {!result ? (
        <div className="form-wrapper">
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
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="result-container">
          <h2>Final Result</h2>
          <h2>
            <strong>Score:</strong> {result.score}
          </h2>
          {computedResults && (
    <>
      <h2><strong>Total Questions:</strong> {computedResults.totalQuestions}</h2>
      
    </>
  )}
          {/* <p>
            <strong>Quiz ID:</strong> {result.quiz_id}
          </p>
          <p>
            <strong>User ID:</strong> {result.user_id}
          </p> */}

          {details && (
            <>
              <h2>Quiz Details</h2>
              <h3>
                <strong>Quiz Name:</strong> {details.quiz.title}
              </h3>
              <h3>
                <strong>Username:</strong> {details.user.name}
              </h3>
              <h3>Questions:</h3>
              <div className="table-wrapper">
                <table className="questions-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Options</th>
                      <th>Correct Option</th>
                      <th>Selected Option</th>
                      <th>Correct?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.questions.map((question, index) => (
                      <tr key={index}>
                        <td>{question.text}</td>
                        <td>{question.options.join(", ")}</td>
                        <td>{question.correctOptionText}</td>
                        <td>{question.selectedOptionText}</td>
                        <td>{question.isCorrect ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Title3;





