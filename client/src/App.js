import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import Auth from './hoc/auth';

function App() {
  return (
    <Router>
      <div>
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time

          만약에 Auth() 사용 시 관리자만 출입 가능한 페이지로 설정하려면
          마지막 파라미터에 true 를 적어준다.
          아무것도 적어주지 않으면 null 이 들어가도록 처리해놨기 때문에 관리자 여부에 상관없이 출입 가능한 페이지가 된다.
        */}
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null, )} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

