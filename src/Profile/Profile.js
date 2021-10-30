import { Avatar, Button, Card, Grid, IconButton, Stack, TextField, Typography } from '@material-ui/core';
import { ArrowBackIosNewRounded, CameraAltRounded } from '@material-ui/icons';
import { Box } from '@material-ui/system';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';
import avatar from '../avatar.JPG';
import axios from 'axios';


let patterns = {
    account_name: /^[A-Za-z]+[A-Za-z0-9]*$/,
    display_name: /^[A-Za-z0-9 ]*$/,
    email_address: /^[A-Za-z0-9]+@[A-Za-z0-9\.]+$/,
    phone_number: /^([0-9]{10})|([0-9]{3}[- ]?[0-9]{3}[- ]?[0-9]{4})$/,
    date_of_birth: /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/,
    zip_code: /^[0-9]{4,5}$/,
    password: /^[\S]{8,}$/,
    password_confirmation: /^[\S]{8,}$/
}

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account_name_data: "NewUserName",
            display_name_data: "NewUserDisplayName",
            email_address_data: "newuser@rice.edu",
            phone_number_data: "123-123-1234",
            date_of_birth_data: "01/01/2000",
            zip_code_data: "77005",
            password_data: "123456789",
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
        this.cancel = null;

        this.checkAuth = this.checkAuth.bind(this);
        this.jumpMain = this.jumpMain.bind(this);
        this.renderDisplayItem = this.renderDisplayItem.bind(this);
        // this.renderUpdateItem = this.renderUpdateItem.bind(this);
        this.handleUpdateInputChange = this.handleUpdateInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        this.checkAuth();

        // TO BE REMOVED
        let self = this;
        
        this.setState({ account_name_data: localStorage.getItem('username') });
        axios.get('https://jsonplaceholder.typicode.com/users',
            {
                cancelToken: new axios.CancelToken(function executor(c) {
                    self.cancel = c;
                })
            })
            .then(function (response) {
                for (let idx in response.data) {
                    if (this.state.account_name_data === response.data[idx].username) {
                        let user = response.data[idx];
                        this.setState({
                            display_name_data: user.name,
                            email_address_data: user.email,
                            phone_number_data: user.phone,
                            zip_code_data: user.address.zipcode
                        });
                    }
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
            });
    }
    componentWillUnmount() {
        // Just for test
        this.cancel();
    }
    checkAuth() {
        let loggedIn = localStorage.getItem("loggedIn");

        if (loggedIn == 'false') {
            this.props.history.push("/welcome");
        }
    }
    jumpMain() {
        this.props.history.push('/main');
    }
    renderDisplayItem(name) {
        let tStr = this.state[name.toLowerCase().replace(/ /g, '_') + '_data'];

        if (name === 'Password') {
            tStr = tStr.replace(/./g, '*');
        }

        return (
            <Box key={name} sx={{ marginLeft: 4 }}>
                <Typography variant='h6'>{name}</Typography>
                <Typography variant='body1' sx={{ marginLeft: 3 }} name={this.state[name.toLowerCase().replace(/ /g, '_')] + '_data'}>{tStr}</Typography>
            </Box>
        );
    }
    // renderUpdateItem(name) {

    // }
    handleUpdateInputChange(e) {
        this.setState({ [e.target.name]: e.target.value });

        this.setState({ [e.target.name + '_validity']: e.target.value === "" || patterns[e.target.name].test(e.target.value) });
    }
    handleSubmit(e) {
        e.preventDefault();

        let updateInfo = [];

        for (let name in patterns) {
            let value = this.state[name];

            if (value != "" || name == "password" && this.state.password_confirmation != "") {
                if (value === this.state[name + '_data']) {
                    toast.error('Please input a new value for ' + name.replace(/_/g, ' '), {
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
                if (value != this.state[name + '_data']) {
                    if (name == "password" && value != this.state.password_confirmation) {
                        toast.error('Please check you password confirmation', {
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

                    if (this.state[name + '_validity'] === false) {
                        toast.error('Invalid Input - ' + name.replace('_', ' '), {
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

                    updateInfo[name] = { name: name, new: this.state[name], old: this.state[name + '_data'] };
                } else if (name === "password" && this.state.password != this.state.password_confirmation) {
                    toast.error('Please check you password confirmation', {
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

        let tStr = 'Updated: ';
        for (let name in updateInfo) {
            this.setState({ [name + '_data']: this.state[name], [name]: "" });
            if (name === "password") {
                this.setState({ password_confirmation: "" });
            }

            if (name === "account_name") {
                localStorage.setItem('username', updateInfo[name].new);
            }

            tStr += name.replace(/_/g, ' ') + ', ';
        }

        tStr = tStr.substr(0, tStr.length - 2) + '.';

        toast.success(tStr, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    render() {
        return (
            <div>
                <Button onClick={this.jumpMain} sx={{ fontWeight: 'bold', fontSize: 40, borderRadius: 3, paddingLeft: 3, paddingRight: 3, left: 10, top: 20 }} startIcon={<ArrowBackIosNewRounded sx={{ width: 40, height: 40 }} />}>
                    Main
                </Button>

                {/* <Box sx={{ position: 'absolute', right: 400, top: 60 }}> */}
                <Card raised={true} sx={{ position: 'absolute', top: 60, right: 120, width: 160, height: 160, borderRadius: 80 }}>
                    <Avatar alt="avatar" src={avatar} sx={{ width: 160, height: 160 }} />
                    <label htmlFor="avatar-img-upload">
                        <input accept="image/*" id="avatar-img-upload" type="file" />
                        <IconButton component='span' sx={{ position: 'absolute', top: 0, left: 0, width: 160, height: 160, color: 'transparent', ":hover": { color: '#ffffffcc', boxShadow: '0px 4px 4px 0px #00000055' }, transition: 'boxShadow 0.8s cubic-bezier(0.19, 1, 0.22, 1)' }}>
                            <CameraAltRounded sx={{ fontSize: 80, opacity: 1 }} />
                        </IconButton>
                    </label>
                </Card>
                <Typography sx={{ position: 'absolute', top: 240, right: 50, fontSize: 20, opacity: 0.75 }}>Click avatar ↑ to upload image</Typography>

                <Grid container justifyContent='space-around' alignItems='stretch' spacing={0} sx={{ position: 'absolute', top: 300, bottom: 0, left: 0, right: 0, padding: 4 }}>
                    <Grid item xs={5}>
                        <Card raised={true} sx={{ position: 'relative', height: '100%', width: '100%', borderRadius: 3 }}>
                            <Stack
                                direction="column"
                                justifyContent="space-around"
                                alignItems="flex-start"
                                spacing={0}
                                padding={5}
                                overflow="scroll"
                                sx={{ position: 'absolute', top: 0, bottom: 10, left: 0, right: 0 }}
                            >
                                <Typography variant='h5'>Current Info</Typography>
                                {['Account Name', 'Display Name', 'Email Address', 'Phone Number', 'Date of Birth', 'Zip Code', 'Password'].map((item) => { return this.renderDisplayItem(item); })}
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={5}>
                        <Card raised={true} sx={{ position: 'relative', height: '100%', width: '100%', borderRadius: 3 }}>
                            <Stack
                                direction="column"
                                justifyContent="space-around"
                                alignItems="stretch"
                                spacing={0}
                                padding={5}
                                overflow="scroll"
                                sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
                                component="form" onSubmit={this.handleSubmit}
                            >
                                <Typography variant='h5'>Update Info</Typography>
                                <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.account_name_validity}
                                    label="Account Name"
                                    name="account_name"
                                    variant="outlined"
                                    // placeholder="Your user name"
                                    value={this.state.account_name}
                                    onChange={this.handleUpdateInputChange}
                                    helperText={!this.state.account_name === '' ? 'Start with character' : ''}
                                />
                                <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.display_name_validity}
                                    label="Display Name (Optional)"
                                    name="display_name"
                                    variant="outlined"
                                    // placeholder="Your display name"
                                    value={this.state.display_name}
                                    onChange={this.handleUpdateInputChange}
                                />
                                <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.email_address_validity}
                                    label="E-mail Address"
                                    name="email_address"
                                    variant="outlined"
                                    placeholder="nickname@server"
                                    value={this.state.email_address}
                                    onChange={this.handleUpdateInputChange}
                                    helperText={!this.state.account_name_validity ? 'nickname@server' : ''}
                                />
                                <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.phone_number_validity}
                                    label="Phone Number"
                                    name="phone_number"
                                    variant="outlined"
                                    placeholder="123-123-1234"
                                    value={this.state.phone_number}
                                    onChange={this.handleUpdateInputChange}
                                // helperText={!this.state.phone_number_validity ? 'Required' : ''}
                                />
                                <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.date_of_birth_validity}
                                    label="Date of Birth"
                                    name="date_of_birth"
                                    variant="outlined"
                                    placeholder="mm/dd/yyyy"
                                    value={this.state.date_of_birth}
                                    onChange={this.handleUpdateInputChange}
                                // helperText={!this.state.date_of_birth_validity ? 'Required' : ''}
                                />
                                <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.zip_code_validity}
                                    label="Zip Code"
                                    name="zip_code"
                                    variant="outlined"
                                    placeholder="#### or #####"
                                    value={this.state.zip_code}
                                    onChange={this.handleUpdateInputChange}
                                // helperText={!this.state.zip_code_validity ? 'Required' : ''}
                                />
                                <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.password_validity}
                                    label="Password"
                                    name="password"
                                    variant="outlined"
                                    placeholder="at least 8 characters"
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.handleUpdateInputChange}
                                    helperText={!this.state.password_validity ? 'At least 8 characters' : ''}
                                />
                                <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.password_confirmation_validity}
                                    label="Password Confirmation"
                                    name="password_confirmation"
                                    variant="outlined"
                                    placeholder="repeat your password"
                                    type="password"
                                    value={this.state.password_confirmation}
                                    onChange={this.handleUpdateInputChange}
                                    helperText={!this.state.password_confirmation_validity ? 'At least 8 characters' : ''}
                                />
                                <Box fullWidth={true} textAlign='center'>
                                    <Button variant="contained" type="submit">Update
                                        <i className="material-icons right">check</i>
                                    </Button>
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        )
    };
}

export default withRouter(Profile);