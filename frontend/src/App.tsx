import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from './pages/Home'
import Error from './pages/Error'
import PrivateRoute from "./components/PrivateRoute"
import Denuncias from './pages/Denuncias'
import NovaDenuncia from './pages/NovaDenuncia'
import DashboardDenuncias from './pages/DashboardDenuncias'
import DashboardUsuarios from './pages/DashboardUsuarios'
import MinhasDenuncias from './pages/MinhasDenuncias'
import AcompanharDenuncia from './pages/AcompanharDenuncias'

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/denuncias' element={<Denuncias/>}/>
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/denuncias"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <DashboardDenuncias />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/usuarios"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <DashboardUsuarios />
            </PrivateRoute>
          }
        />
        <Route
          path="/nova-denuncia"
          element={
            <PrivateRoute allowedRoles={['user','admin']}>	
              <NovaDenuncia />
            </PrivateRoute>
          }
        />
        <Route
          path="/minhas-denuncias"
          element={
            <PrivateRoute allowedRoles={['user','admin']}>	
              <MinhasDenuncias />
            </PrivateRoute>
          }
        />
        <Route
          path="/minhas-denuncias/:protocolo"
          element={
            <PrivateRoute allowedRoles={['user','admin']}>	
              <AcompanharDenuncia />
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
