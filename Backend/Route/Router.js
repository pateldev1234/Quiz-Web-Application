const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');


const UserDetail = require("../Model/UserDetails");
const Quiz = require("../Model/Quiz");
const Result = require("../Model/Results");
const Question = require("../Model/Questions");
const Answer = require("../Model/Answer");



router.post('/signup', async (req, res) => {
    try {
        
        const { userid, name, email, password, cpassword } = req.body;

       
        if (!userid || !name || !email || !password || !cpassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate email format using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number."
            });
        }

        // Check if passwords match
        if (password !== cpassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Check if the user already exists
        const existingUser = await UserDetail.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        const existingUser1 = await UserDetail.findOne({ userId:userid });
        if (existingUser1) {
            return res.status(400).json({ message: "User already exists with this userid." });
        }

        // Create a new user
        const newUser = new UserDetail({
            userId: userid,
            name,
            email,
            password
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Respond with the created user data
        return res.status(201).json({ message: "User created successfully.", user: savedUser });
    } catch (error) {
        console.error("Error during signup:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { userid, password } = req.body;

        
        if (!userid || !password) {
            return res.status(400).json({ message: "User ID and password are required." });
        }

        
        const existingUser = await UserDetail.findOne({ userId: userid });

        // Check if the user exists
        if (!existingUser) {
            return res.status(404).json({ message: "User does not exist." });
        }

        // Compare passwords (Assuming passwords are hashed in the database)
        const isPasswordMatch = (existingUser.password === password); // Replace with bcrypt.compare if hashed

        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials. Password mismatch." });
        }

        // If login is successful
        return res.status(201).json({
            message: "Login successful.",
            user: {
                id: existingUser._id,
                userid: existingUser.userId,
                name: existingUser.name,
                email: existingUser.email,
            },
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
});

router.post("/StoreQuiz", async (req, res) => {
    try {
        const { title, id, userid } = req.body;

        // Validate required fields
        if (!title || !id || !userid) {
            return res.status(400).json({ message: "Some fields are empty." });
        }

        // Check if the user exists in the UserDetail table
        const existingUser = await UserDetail.findOne({ userId: userid ,_id:id});

        // Check if the user exists
        if (!existingUser) {
            return res.status(404).json({ message: "User does not exist." });
        }

        // Check if the quiz already exists for the given title
        const existingQuiz = await Quiz.findOne({ title:title, userId: id });

        if (existingQuiz) {
            return res.status(400).json({ message: "Quiz already exists for this user." });
        }

        // Create a new quiz if the user exists and the quiz does not
        const ans2 = await Quiz({
            title:title,
            userId:id
        });

        const ans4  = await ans2.save();

        // Send a success response
        res.status(201).json({
            message: "Successfully added the quiz to the database.",
            quiz: ans4,
        });
    } catch (error) {
        console.error("Error while storing quiz:", error.message);
        res.status(500).json({ message: "There is some error." });
    }
});

router.post("/StoreQuizQuestion",async (req,res)=>
{
    try
    {
        const {qid,uid,userid,title,text,options,correctOption} = req.body;

        const ans1 = await UserDetail.findOne({userId:userid});
        

        if(!ans1)
        {
            res.status(400).json({message:"User does not exist"});
        }

        const ans2 = await Quiz.findOne({title:title , userId:uid});

        if(!ans2)
        {
            res.status(400).json({message : "Quiz does not exists for this user"});
        }

         // Validate options length and correct option index
         if (!Array.isArray(options) || options.length !== 4) {
            return res.status(400).json({ message: "There must be exactly 4 options." });
        }

        if (correctOption < 0 || correctOption > 3) {
            return res.status(400).json({ message: "The correct option index must be between 0 and 3." });
        }

        // Create the question object and save it to the database
        const question = new Question({
            userId: ans1._id, // Use the user's _id (not userId)
            quizId: ans2._id, // Use the quiz's _id (not title)
            text: text,
            options: options,
            correctOption: correctOption
        });

        // Save the question
        const savedQuestion = await question.save();

        // Return a success response with the saved question
        res.status(201).json({
            message: "Question added successfully.",
            question: savedQuestion
        });
    }
    catch(error)
    {
        console.log("There is some Error");
        res.status(500).json({message:"There is some error"});
    }

})

router.get("/GetQuizQuestion",async(req,res)=>
{
    try
    {
        const {uid,userid,title} = req.query;

        const ans1 = await UserDetail.findOne({userId:userid});

        if(!ans1)
        {
            return res.status(400).json({message:"User does not exist"});
        }

        const ans2 = await Quiz.findOne({title:title , userId:uid});
        console.log(ans2);

        if(!ans2)
        {
            return res.status(400).json({message : "Quiz does not exists for this user"});
        }

        const ans3 = await Question.find({quizId:ans2._id,userId:uid});

        if (!ans3 || ans3.length === 0) {
            // console.log("there is the error");
            return res.status(404).json({ message: "No questions found for this quiz." });
        }

        return res.status(200).json({message:"Question of the Quiz",question:ans3});

    }
    catch(error)
    {
        console.log("There is some error");
        res.status(500).json({message:"There is some error"});
    }
})

router.post("/submitanswer" , async(req,res)=>
{
    try
    {
        const {qid,uid,userid,title,text,iscorrect,option} = req.body;

        if (!qid || !uid || !userid || !title || !text) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        const ans1 = await UserDetail.findOne({userId:userid});

        if(!ans1)
        {
            return res.status(400).json({message:"User does not exist"});
        }

        const ans2 = await Quiz.findOne({title:title , userId:uid});

        if(!ans2)
        {
            return res.status(400).json({message : "Quiz does not exists for this user"});
        }

        const ans3 = await Question.findOne({quizId:ans2._id , userId:uid,text:text});
        
        if(!ans3)
        {
            return res.status(400).json({message:"Question does not exists"});
        }
        else
        {
            console.log(ans3._id);
            const ans4 = await Answer.findOne({question_id:ans3._id});
            
            if(!ans4)
            {
            const ans6 = new Answer({
                question_id:ans3._id,
                selected_option:option,
                is_correct:iscorrect
            })

            const ans5 = await ans6.save();
            return res.status(201).json({message:"This is the correct answer",ans5});
            }
            else
            {
                ans4.selected_option = option;
                ans4.is_correct = iscorrect;
                const updatedAns4 = await ans4.save();
                return res.status(200).json({ message: "Answer updated successfully", ans: updatedAns4 });
            }
        }
    }
    catch(error)
    {
       // console.log("There is some error in the code");
        return res.status(500).json({message:"There is som error in the code"});
    }
})

router.post("/finalsubmit",async(req,res)=>
{
    try
    {
        const {qid,uid,userid,title} = req.body;

        const ans1 = await UserDetail.findOne({userId:userid});
        
        let totalScore = 0;
        const questionResults = [];
        
        if(!ans1)
        {
            return res.status(400).json({message:"User does not exist"});
        }

        const ans2 = await Quiz.findOne({title:title , userId:uid});

        if(!ans2)
        {
            return res.status(400).json({message : "Quiz does not exists for this user"});
        }

        //console.log("uid" + uid);
        //console.log("qid" + qid);
        //console.log(ans2._id);
        //console.log(qid);
        //console.log(uid);
        const ans3 = await Question.find({userId:uid,quizId:ans2._id});

        const ans10 = await Result.find({user_id:uid,quiz_id:ans2._id});
        
        //console.log(ans10.length);
        //console.log(ans10[0].score);
        //console.log(ans10[0].questions);

        if(!ans3)
        {
            return res.status(400).json({message:"Questions does not exists for this user"});
        }
        else
        {
            //console.log(ans3);
            //console.log(ans3.length);

            for(let i=0;i<ans3.length;i++)
            {
                const question = ans3[i];
                //console.log(question._id);

                const ans4 = await Answer.findOne({question_id:question._id});

                //console.log(ans4);

                if(!ans4)
                {
                    return res.status(400).json({message:"Questions does not exists for this user"});
                }
                else
                {
                    totalScore += ans4.is_correct ? 1 : 0;
                    questionResults.push({
                        question_id: question._id,
                        answer: ans4.selected_option,
                    });
                }      
            }

            if(ans10.length==0)
            {
        
            const result = new Result({
                quiz_id: ans2._id,
                user_id: uid,
                score: totalScore,
                questions: questionResults,
            });

            await result.save();
            //console.log(result);

            return res.status(201).json({
            message: "Result successfully saved.",
            result,
            });
            }
            else
            {
                console.log(totalScore);
                ans10[0].score = totalScore;
                ans10[0].questions =  questionResults;
                const updatedAns4 = await ans10[0].save();
                return res.status(200).json({ message: "Answer updated successfully", result: updatedAns4 });

            }
            }

    }
    catch(error)
    {
        console.log("there is some error");
        return res.status(500).json({message:"There is some error"});
    }
})

router.get("/finalresult",async(req,res)=>{
    try
    {
        const {qid,uid,userid,title} = req.query;
        //console.log(qid);
        //console.log(uid);
        //console.log(title);
        //console.log(userid);

        const ans1 = await UserDetail.findOne({userId:userid});
        //console.log(ans1);
        //console.log(title);
        if(!ans1)
        {
            return res.status(400).json({message:"User does not exist"});
        }

        const ans2 = await Quiz.findOne({title:title , userId:ans1._id});

        //console.log(ans2);
        //console.log(ans2.length);
        //console.log(ans2);

        if(!ans2)
        {
            //console.log("there is not one");
            return res.status(400).json({message : "Quiz does not exists for this user"});
        }

        //console.log(ans2._id);
        //console.log(uid);
        //console.log(ans1._id);
        const ans3  = await Result.findOne({quiz_id:ans2._id,user_id:uid});
        //console.log(ans3.length);
        //console.log(ans3);
        //console.log(ans3);
        if(!ans3)
        {
            ///console.log("there is the error");
            return res.status(400).json({message : "Result of the Quiz does not exists for this user"});
        }
        else
        {
            return res.status(201).json({message:"Succesfully fetched the scores",result:ans3});
        }

    }
    catch(error)
    {
        //console.log("there is some error");
        return res.status(500).json({message:"There is some error"});
    }
})

router.get("/getanswer",async(req,res)=>
{
    try
    {
        const {qid,uid,userid,title,text} = req.query;

        if (!qid || !uid || !userid || !title || !text) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        const ans1 = await UserDetail.findOne({userId:userid});
        console.log(ans1);


        if(!ans1)
        {
            return res.status(400).json({message:"User does not exist"});
        }

        const ans2 = await Quiz.findOne({title:title , userId:uid});

        console.log(ans2);

        if(!ans2)
        {
            return res.status(400).json({message : "Quiz does not exists for this user"});
        }

        const ans3 = await Question.findOne({quizId:ans2._id , userId:uid,text:text});
        
        if(!ans3)
        {
            return res.status(400).json({message:"Question does not exists"});
        }
        else
        {
            return res.status(201).json({message:"This is the correct answer",ans3});
        }
    }
    catch(error)
    {
        console.log("there is some error  in the code");
        return res.status(500).json({message:"There is some error in the code"});
    }

})


router.get("/getquizbyId", async(req,res)=>
{
    try
    {
        //console.log(qid);
        const {qid} = req.query;
        const ans1  = await Quiz.findOne({_id:qid});

        if(!ans1)
        {
            return res.status(400).json({message:"Quiz does not exists"});
        }
        else
        {
            //console.log(ans1);
            return res.status(200).json({message:"Quiz Exist" , data:ans1});
        }


    }
    catch(error)
    {
        //console.log("there is some error");
        return res.status(500).json({message:"There is some error"});
    }
})

router.get("/getuserbyId", async(req,res)=>
{
        try
        {
            const {uid} = req.query;
            const ans1  = await UserDetail.findOne({_id:uid});

            if(!ans1)
            {
                return res.status(400).json({message:"Quiz does not exists"});
            }
            else
            {
                //console.log(ans1);
                return res.status(200).json({message:"Quiz Exist" , data:ans1});
            }
        }
        catch(error)
        {
            //console.log("there is some error");
            return res.status(500).json({message:"There is some error"});
        }
})


router.get("/getquestionbyId", async(req,res)=>
{
        try
        {
            
            const {qid} = req.query;
            console.log(qid);
            const ans1  = await Question.findOne({_id:qid});
    
            if(!ans1)
            {
                return res.status(400).json({message:"Quiz does not exists"});
            }
            else
            {
                //console.log(ans1);
                return res.status(200).json({message:"Quiz Exist" , data:ans1});
            }
        }
        catch(error)
        {
            //console.log("there is some error");
            return res.status(500).json({message:"There is some error"});
        }
})

router.get("/getanswerbyId", async(req,res)=>
    {
            try
            {
                
                const {qid} = req.query;
                console.log(qid);
                const ans1  = await Answer.findOne({question_id:qid});
        
                if(!ans1)
                {
                    return res.status(400).json({message:"Quiz does not exists"});
                }
                else
                {
                    //console.log(ans1);
                    return res.status(200).json({message:"Quiz Exist" , data:ans1});
                }
            }
            catch(error)
            {
                //console.log("there is some error");
                return res.status(500).json({message:"There is some error"});
            }
    })





module.exports = router;



