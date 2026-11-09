import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from './pages/Home'
import Error from './pages/Error'
import PrivateRoute from "./components/PrivateRoute"

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path='*' element={<Error/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
