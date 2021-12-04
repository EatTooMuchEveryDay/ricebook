import axios from 'axios';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery'
import Login from './Login';
import Register from './Register';
import './Welcome.css';
import { ToastContainer, toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { setUsername } from "../actions";
import config from '../config';

axios.defaults.withCredentials = true;

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

        if (loggedIn == 'true') {
            // this.props.username=localStorage.getItem("username");
            this.props.setUsername(localStorage.getItem("username"));
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

        this.props.setUsername(username);

        // jump
        this.props.history.push("/main");
    }
    register(user) {
        axios.post(config.server_url + "/register", user)
            .then(function (response) {
                if (response.data.result != 'success') {
                    toast.error('Username duplicated!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    // toast move to main
                    toast.success('Welcome to join us, ' + response.data.username + '!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    axios.post(config.server_url + '/login', {
                        username: user.username,
                        password: user.password
                    })
                        .then(function (response) {
                            if (response.data.result == 'success') {
                                localStorage.setItem("loggedIn", true);
                                localStorage.setItem("username", response.data.username);

                                this.props.setUsername(response.data.username);

                                // jump
                                this.props.history.push("/main");
                            }

                            if (response.data.result != 'success') {
                                toast.error('Sorry, invalid account and password', {
                                    position: "top-right",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: false,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                });
                            }
                        }.bind(this))
                        .catch(function (error) {
                            toast.error('Unable to connect server', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: false,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                        });
                }
            }.bind(this))
            .catch(function (error) {
                toast.error('Unable to connect server', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
    }

    // testFunc(){
    //     console.log('test function from welcome.js');
    // }

    render() {
        return (
            <Grid container spacing={2} marginTop={5}>
                <Grid item xs={6}>
                    <Login login={this.login} />
                </Grid>
                <Grid item xs={6}>
                    <Register register={this.register} />
                </Grid>
                {/* <ToastContainer /> */}
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.username
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUsername: (username) => dispatch(setUsername(username))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Welcome));