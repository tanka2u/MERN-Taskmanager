import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import ManageTasks from './pages/Admin/ManageTasks'
import CreateTask from './pages/Admin/CreateTask'
import UserDashboard from './pages/User/UserDashboard'
import MyTasks from './pages/User/MyTasks'
import PrivateRoute from './routes/PrivateRoute'
import UserProvider, { UserContext } from './context/userContext'
import ManageUsers from './pages/Admin/ManageUsers'
import ViewTaskDetails from './pages/User/ViewTaskDetails'

const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path='/login' element = {<Login />} />
          <Route path='/SignUp' element = {<SignUp />} />

          {/*admin Roles*/}
          <Route element= {<PrivateRoute allowedRoles ={["admin"]}/>}>
            <Route path='/admin/dashboard' element= {<Dashboard />}/>
            <Route path='/admin/tasks' element= {<ManageTasks />}/>
            <Route path='/admin/create-task' element= {<CreateTask />}/>
            <Route path='/admin/users' element= {<ManageUsers />}/>
          </Route>

          {/*User Roles*/}
          <Route element= {<PrivateRoute allowedRoles ={["user"]}/>}>
            <Route path='/user/dashboard' element= {<UserDashboard />}/>
            <Route path='/user/tasks' element= {<MyTasks />}/>
            <Route path='/user/task-details/:id' element= {<ViewTaskDetails />}/>
          </Route>
          {/*Default Route*/}
          <Route path='/' element={<Root />}/>
        </Routes>
      </Router>
    </div>
    </UserProvider>
  )
}

export default App;

  const Root = () => {
    const { user, loading } = useContext(UserContext);

    if(loading) return <Outlet />

    if(!user) {
      return <Navigate to = "/login" />
    }

    return user.role === "admin" ? <Navigate to = "/admin/dashboard" /> : <Navigate to = "/user/dashboard" />;
  };
