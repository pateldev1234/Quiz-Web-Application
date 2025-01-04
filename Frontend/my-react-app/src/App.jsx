import { useState,useEffect,useContext} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router ,Route ,Routes,useLocation} from 'react-router-dom'
import Login from './Component/Login/Login'
import Signup from './Component/Signup/Signup'
import QuizOptions from './Component/QuizOptions/QuizOptions'
import Title1 from './Component/Title1/Title1'
import Title2 from './Component/Title2/Title2'
import Title3 from './Component/Title3/Title3'
import Title4 from './Component/Title4/Title4'
import Questions from './Component/Questions/Questions'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}> </Route>
        <Route path='/signup' element={<Signup/>}> </Route>
        <Route path="/QuizOptions"  element={<QuizOptions/>}></Route>
        <Route path='/Title1' element = {<Title1/>}></Route>
        <Route path='/Title2' element = {<Title2/>}></Route>
        <Route path='/Title3' element = {<Title3/>}></Route>
        <Route path='/Title4' element = {<Title4/>}></Route>
        <Route path='/Questions' element = {<Questions/>}></Route>
      </Routes>
    </>
  )
}

export default App
