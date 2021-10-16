import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom';
// import { Router, Route, Redirect } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from "redux";
import { ricebookApp } from './reducers';
import NavBar from './NavBar';
import Welcome from './Welcome/Welcome';
import Main from './Main/Main';
import Profile from './Profile/Profile';

const store = createStore(ricebookApp);

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <Provider store={store}>
      <Router>
        <Route path="/">
          {/* <Switch> */}
          {/* <App> */}
          {/* <Route path="accounts"></Route> */}
          {/* </App> */}
          {/* </Switch> */}
          <NavBar />
        </Route>
        {/* <Redirect from="/" to="welcome" /> */}
        <Switch>
          <Route exact path="/welcome">
            <Welcome />
          </Route>
          <Route exact path="/main">
            <Main />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Redirect from="/*" to="welcome" />
        </Switch>

      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
