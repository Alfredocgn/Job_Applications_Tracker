import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import './App.css'
import { Login } from './components/Login'
import { SignUp } from './components/SignUp'
import { Home } from './components/Home'
import { CreateApplication } from './components/CreateApplication'
import { NotFound } from './components/NotFound'


function App() {


  return (
    <>
    <Router>
      <Routes>
        <Route path='/' Component={Login}/>
        <Route path='/signup' Component={SignUp}/>
        <Route path='/home' Component={Home}/>
        <Route path='/new' Component={CreateApplication}/>
        <Route path='*' Component={NotFound}/>

      </Routes>
    </Router>
    
    </>
  )
}

export default App
