import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Stack, Typography, TextField, Button } from '@material-ui/core';
import config from '../config';

let patterns = {
  account_name: /^[A-Za-z0-9]+$/,
  password: /^.+$/
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_name: "",
      password: "",
      account_name_validity: true,
      password_validity: true
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
  }
  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });

    this.setState({ [e.target.name + '_validity']: patterns[e.target.name].test(e.target.value) });
  }
  handleSubmit(e) {
    e.preventDefault();

    for (let i in this.state) {
      if (i.length > 8 && i.substr(i.length - 8, 8) === 'validity') {
        if (this.state[i] === false) {
          toast.error('Invalid Input - ' + i.substr(0, i.length - 9).replace('_', ' '), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return;
        }
      }
    }

    axios.post(config.server_url + '/login', {
      username: this.state.account_name,
      password: this.state.password
    }, { withCredentials: true })
      .then(function (response) {
        if (response.data.result == 'success') {
          this.props.login(response.data.username);
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

  googleLogin(e){

  }

  render() {
    return (
      <Stack spacing={2} sx={{ textAlign: 'center' }}>
        {/* <center> */}
        <Typography variant="h3">Login</Typography>
        {/* </center> */}
        {/* <div className="row"> */}
        <Box component="form" onSubmit={this.handleSubmit}>
          <div className="welcome-form-row">
            <TextField
              className="welcome-form-input"
              required
              error={!this.state.account_name_validity}
              label="Account Name"
              name="account_name"
              variant="outlined"
              placeholder="Your user name"
              value={this.state.account_name}
              onChange={this.handleInputChange}
              // pattern="[A-Za-z0-9]+"
              helperText={!this.state.account_name_validity ? 'Required' : ''}
            />
          </div>
          <div className="welcome-form-row">
            <TextField
              className="welcome-form-input"
              required
              error={!this.state.password_validity}
              label="Password"
              type="password"
              name="password"
              variant="outlined"
              value={this.state.password}
              onChange={this.handleInputChange}
              helperText={!this.state.password_validity ? 'Required' : ''}
            // pattern=".+"
            />
            {/* <div className="row">
            <div className="input-field col s12">
            <input id="login-account-name" className="validate" type="text" name="account_name" value={this.state.account_name} onChange={this.handleInputChange} pattern="[A-Za-z0-9]+" required />
            <label htmlFor="login-account-name">Account Name</label>
            </div>
          </div> */}
            {/* <div className="row">
            <div className="input-field col s12">
            <input id="login-password" className="validate" type="password" name="password" value={this.state.password} onChange={this.handleInputChange} pattern=".+" required />
            <label htmlFor="login-password">Password</label>
            </div>
          </div> */}
          </div>
          <div>
            {/* <center> */}
            <Button variant="contained" type="submit">Submit
              <i className="material-icons right">send</i>
            </Button>
            {/* </center> */}
          </div>
        </Box>

        {/* <div>
          <Button variant="contained" href={config.server_url+'/auth/google'}>Google Login
            <i className="material-icons right">send</i>
          </Button>
        </div> */}
        {/* </div> */}
      </Stack>
    );
  }
}

export default Login;