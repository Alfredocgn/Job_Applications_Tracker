import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import { Login } from './components/Login'
import { SignUp } from './components/SignUp'
import { Home } from './components/Home'
import { CreateApplication } from './components/CreateApplication'
import { NotFound } from './components/NotFound'
import { Companies } from './components/Companies'
import { Navbar } from './components/Navbar'


function App() {


  return (
    <>
    <Navbar />
    <Router>
      <Routes>
        <Route path='/' Component={Login}/>
        <Route path='/signup' Component={SignUp}/>
        <Route path='/home' Component={Home}/>
        <Route path='/new' Component={CreateApplication}/>
        <Route path='/companies' Component={Companies}/>
        <Route path='*' Component={NotFound}/>

      </Routes>
    </Router>
    
    </>
  )
}

export default App
