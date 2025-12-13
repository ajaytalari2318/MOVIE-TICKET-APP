import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {BrowserRouter,Route,Router,Routes} from 'react-router-dom'
import './App.css'
import Login from './pages/login'
import Register from './pages/register'
import Homepage from './pages/Homepage'
function App() {
  

  return (
    <>
    <BrowserRouter>
     <Routes>
      <Route path='/home' element={<Homepage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
     </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
