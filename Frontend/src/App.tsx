import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import './App.css'
import { Login } from './components/Login'
import { SignUp } from './components/SignUp'
import { Home } from './components/Home'


function App() {


  return (
    <>
    <Router>
      <Routes>
        <Route path='/' Component={Login}/>
        <Route path='/signup' Component={SignUp}/>
        <Route path='/home' Component={Home}/>

      </Routes>
    </Router>
    
    </>
  )
}

export default App
