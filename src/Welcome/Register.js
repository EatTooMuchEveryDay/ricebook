import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Stack, Typography, TextField, Button } from '@material-ui/core';
import config from '../config';

let patterns = {
  account_name: /^[A-Za-z]+[A-Za-z0-9]*$/,
  display_name: /^[A-Za-z0-9 ]*$/,
  email_address: /^[A-Za-z0-9]+@[A-Za-z0-9\.]+$/,
  phone_number: /^[0-9]{3}[- ]?[0-9]{3}[- ]?[0-9]{4}$/,
  date_of_birth: /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/,
  zip_code: /^[0-9]{4,5}$/,
  password: /^[\S]{8,}$/,
  password_confirmation: /^[\S]+$/
}

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_name: "",
      display_name: "",
      email_address: "",
      phone_number: "",
      date_of_birth: "",
      zip_code: "",
      password: "",
      password_confirmation: "",
      account_name_validity: true,
      display_name_validity: true,
      email_address_validity: true,
      phone_number_validity: true,
      date_of_birth_validity: true,
      zip_code_validity: true,
      password_validity: true,
      password_confirmation_validity: true
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })

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

    if (this.state.password != this.state.password_confirmation) {
      toast.error('Check you password confirmation', {
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

    let currentDate = new Date(), flag = true;
    let array = this.state.date_of_birth.split("/");
    if (currentDate.getFullYear() - array[2] < 18) {
      flag = false;
    } else if (currentDate.getFullYear() - array[2] == 18) {
      if (currentDate.getMonth() + 1 < array[0]) {
        flag = false;
      } else if (currentDate.getMonth() + 1 == array[0]) {
        if (currentDate.getDate() < array[1]) {
          flag = false;
        }
      }
    }
    if (flag === false) {
      toast.error("You need to be 18 years old at least.", {
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

    this.props.register({
      username: this.state.account_name,
      password: this.state.password,
      zipcode: this.state.zip_code,
      email: this.state.email_address,
      dob: this.state.date_of_birth
    });
  }

  render() {
    return (
      <Stack spacing={2} sx={{ textAlign: 'center' }}>
        <Typography variant="h3">Register</Typography>
        <Box component="form" onSubmit={this.handleSubmit}>
          <div className="welcome-form-row">
            <TextField
              className="welcome-form-input"
              required
              error={!this.state.account_name_validity}
              label="Account Name"
              name="account_name"
              variant="filled"
              // placeholder="Your user name"
              value={this.state.account_name}
              onChange={this.handleInputChange}
              helperText={!this.state.account_name === '' ? 'Required' : ''}
            />
          </div>
          <div className="welcome-form-row">
            <TextField
              className="welcome-form-input"
              error={!this.state.display_name_validity}
              label="Display Name (Optional)"
              name="display_name"
              variant="filled"
              // placeholder="Your display name"
              value={this.state.display_name}
              onChange={this.handleInputChange}
              helperText={!this.state.display_name === '' ? 'Required' : ''}
            />
          </div>
          <div className="welcome-form-row">
            <TextField
              className="welcome-form-input"
              required
              error={!this.state.email_address_validity}
              label="E-mail Address"
              name="email_address"
              variant="filled"
              placeholder="nickname@server"
              value={this.state.email_address}
              onChange={this.handleInputChange}
              helperText={!this.state.account_name_validity ? 'nickname@server' : ''}
            />
          </div>
          <div className="welcome-form-row">
            <TextField
              className="welcome-form-input"
              required
              error={!this.state.phone_number_validity}
              label="Phone Number"
              name="phone_number"
              variant="filled"
              placeholder="123-123-1234"
              value={this.state.phone_number}
              onChange={this.handleInputChange}
              helperText={!this.state.phone_number_validity ? 'Required' : ''}
            />
          </div>
          <div className="welcome-form-row">
            <TextField
              className="welcome-form-input"
              required
              error={!this.state.date_of_birth_validity}
              label="Date of Birth"
              name="date_of_birth"
              variant="filled"
              placeholder="mm/dd/yyyy"
              value={this.state.date_of_birth}
              onChange={this.handleInputChange}
              helperText={!this.state.date_of_birth_validity ? 'Required' : ''}
            />
          </div>
          <div className="welcome-form-row">
            <TextField
              className="welcome-form-input"
              required
              error={!this.state.zip_code_validity}
              label="Zip Code"
              name="zip_code"
              variant="filled"
              placeholder="#### or #####"
              value={this.state.zip_code}
              onChange={this.handleInputChange}
              helperText={!this.state.zip_code_validity ? 'Required' : ''}
            />
          </div>
          <div className="welcome-form-row">
            <TextField
              className="welcome-form-input"
              required
              error={!this.state.password_validity}
              label="Password"
              name="password"
              variant="filled"
              placeholder="at least 8 characters"
              type="password"
              value={this.state.password}
              onChange={this.handleInputChange}
              helperText={!this.state.password_validity ? 'Required' : ''}
            />
          </div>
          <div className="welcome-form-row">
            <TextField
              className="welcome-form-input"
              required
              error={!this.state.password_confirmation_validity}
              label="Password Confirmation"
              name="password_confirmation"
              variant="filled"
              placeholder="repeat your password"
              type="password"
              value={this.state.password_confirmation}
              onChange={this.handleInputChange}
              helperText={!this.state.password_confirmation_validity ? 'Required' : ''}
            />
          </div>
          <div>
            {/* <center> */}
            <Button variant="contained" type="submit">Submit
              <i className="material-icons right">send</i>
            </Button>
            {/* </center> */}
          </div>
        </Box>
      </Stack>
    );
  }
}

export default Register;