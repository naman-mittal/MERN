import logo from './logo.svg';
import './App.css';
import Profile from './components/Profile'
import Signin from './components/Signin'
import Signup from './components/Signup'
import ForgotPassword from './components/ForgotPassword'
import PublicRoute from './components/routes/PublicRoute'
import PrivateRoute from './components/routes/PrivateRoute'
import {BrowserRouter as Router,Switch} from 'react-router-dom'

function App() {
  return (
    <Router>

        <Switch>
          <PublicRoute restricted={true} exact path='/signin' component = {Signin}></PublicRoute>
          <PublicRoute restricted={true} exact path='/signup' component = {Signup}></PublicRoute>
          <PublicRoute restricted={true} exact path='/forgot' component = {ForgotPassword}></PublicRoute>
          <PrivateRoute exact path='/home' component = {Profile}></PrivateRoute>
        </Switch>

      </Router>

  );
}

export default App;
