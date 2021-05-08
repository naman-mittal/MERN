import logo from './logo.svg';
import './App.css';
import Profile from './components/Profile'
import Signin from './components/Signin'
import PublicRoute from './components/routes/PublicRoute'
import PrivateRoute from './components/routes/PrivateRoute'
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'

function App() {
  return (
    <Router>

        <Switch>
          <PublicRoute restricted={true} exact path='/signin' component = {Signin}></PublicRoute>
          <PrivateRoute exact path='/home' component = {Profile}></PrivateRoute>
        </Switch>

      </Router>

  );
}

export default App;
