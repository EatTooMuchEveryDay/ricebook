import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery'
import Login from './Login';
import Register from './Register';
import './Welcome.css';
import { ToastContainer, toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';


class Welcome extends Component {
    constructor(props) {
        super(props);

        this.checkAuth = this.checkAuth.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }
    componentDidMount() {
        this.checkAuth();
    }
    checkAuth() {
        let loggedIn = localStorage.getItem("loggedIn");

        if (loggedIn=='true') {
            this.props.history.push("/main");
        }
    }
    login(username) {
        // toast move to main
        toast.success('Welcome back, ' + username + '!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        localStorage.setItem("loggedIn", true);
        localStorage.setItem("username", username);

        // jump
        this.props.history.push("/main");
    }
    register(username) {
        // toast move to main
        toast.success('Welcome to join us, ' + username + '!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        localStorage.setItem("loggedIn", true);
        localStorage.setItem("username", username);

        // jump
        this.props.history.push("/main");
    }

    render() {
        return (
            <Grid container spacing={2} marginTop={5}>
                <Grid item xs={6}>
                    <Login login={this.login} />
                </Grid>
                <Grid item xs={6}>
                    <Register register={this.register} />
                </Grid>
                <ToastContainer />
            </Grid>
        );
    }
}

export default withRouter(Welcome);