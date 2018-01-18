import React, {Component} from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import {ajaxUtil} from './util/AjaxUtils';

import LayoutRoute from './module/base/LayoutRoute'
import LoginForm from './module/base/login/LoginForm'

class LoginCheck extends Component {
    render() {
        return (<div>check1111</div>);
    }
    componentDidMount() {
        let from = this.props.from;
        ajaxUtil("json", "person!isLogin.action", {}, this, (data, that) => {
            console.log("global is ---",global);
            global.isAuthenticated = true;
            console.log("from",from.pathname);
            if (from.pathname==="/") {
              from.pathname="/main";
            }
            global.router.history.push("/main");
        })
    }
}


const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => (
        global.isAuthenticated ? (
                <Component {...props}/>
            ) : (
                <LoginCheck from={props.location}/>
            )
    )}/>
)

class App extends Component {
    constructor(props) {
        super(props);
        global.isAuthenticated = false;
    }

    render() {
        return (
            <Router ref={(router) => {
                global.router = router;
            }}>
                <Switch>
                    <Route path="/login" component={LoginForm}/>
                    <PrivateRoute path="/" component={LayoutRoute}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
