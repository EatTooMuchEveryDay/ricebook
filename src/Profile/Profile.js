import { Avatar, Button, Card, Grid, IconButton, Stack, TextField, Typography } from '@material-ui/core';
import { ArrowBackIosNewRounded, CameraAltRounded, RestaurantRounded } from '@material-ui/icons';
import { Box } from '@material-ui/system';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';
import avatar from '../avatar.JPG';
import axios from 'axios';
import config from '../config';

axios.defaults.withCredentials = true;


let patterns = {
    // username: /^[A-Za-z]+[A-Za-z0-9]*$/,
    // display_name: /^[A-Za-z0-9 ]*$/,
    email: /^[A-Za-z0-9]+@[A-Za-z0-9\.]+$/,
    phone: /^([0-9]{10})|([0-9]{3}[- ]?[0-9]{3}[- ]?[0-9]{4})$/,
    dob: /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/,
    zipcode: /^[0-9]{4,5}$/,
    password: /^[\S]{8,}$/,
    password_confirmation: /^[\S]{8,}$/
}

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: '',
            username_data: "",
            email_data: "",
            phone_data: "",
            dob_data: "",
            zipcode_data: "",
            password_data: "",
            // username: "",
            // display_name: "",
            email: "",
            phone: "",
            dob: "",
            zipcode: "",
            password: "",
            password_confirmation: "",
            // username_validity: true,
            email_validity: true,
            phone_validity: true,
            dob_validity: true,
            zipcode_validity: true,
            password_validity: true,
            password_confirmation_validity: true
        };
        this.checkAuth = this.checkAuth.bind(this);
        this.initProfile = this.initProfile.bind(this);
        this.jumpMain = this.jumpMain.bind(this);
        this.renderDisplayItem = this.renderDisplayItem.bind(this);
        // this.renderUpdateItem = this.renderUpdateItem.bind(this);
        this.handleUpdateInputChange = this.handleUpdateInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }
    componentDidMount() {
        if (!this.checkAuth()) {
            return;
        }

        this.initProfile();
    }
    checkAuth() {
        let loggedIn = localStorage.getItem("loggedIn");

        if (loggedIn == 'false') {
            this.props.history.push("/welcome");
            return false;
        }

        return true;
    }
    jumpMain() {
        this.props.history.push('/main');
    }
    initProfile() {
        // this.setState({ username_data: localStorage.getItem('username') });

        axios.get(config.server_url + '/avatar')
            .then(function (response) {
                this.setState({ avatar: response.data.avatar });
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

        axios.get(config.server_url + '/whoami')
            .then(function (response) {
                this.setState({ username_data: response.data });
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
        axios.get(config.server_url + '/email')
            .then(function (response) {
                this.setState({ email_data: response.data.email });
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
        axios.get(config.server_url + '/zipcode')
            .then(function (response) {
                this.setState({ zipcode_data: response.data.zipcode });
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
        axios.get(config.server_url + '/dob')
            .then(function (response) {
                this.setState({ dob_data: response.data.dob });
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
        axios.get(config.server_url + '/phone')
            .then(function (response) {
                this.setState({ phone_data: response.data.phone });
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
        axios.get(config.server_url + '/passwordlength')
            .then(function (response) {
                let pwd = '';
                for (let idx = 0; idx < response.data.passwordlength; idx++) {
                    pwd += '*';
                }
                this.setState({ password_data: pwd });
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
    renderDisplayItem(_name) {
        // let tStr = this.state[name.toLowerCase().replace(/ /g, '_') + '_data'];

        // if (name === 'Password') {
        //     tStr = tStr.replace(/./g, '*');
        // }
        let name = '';
        switch (_name) {
            case 'Account Name':
                name = 'username';
                break;
            case 'Email Address':
                name = 'email';
                break;
            case 'Phone Number':
                name = 'phone';
                break;
            case 'Date of Birth':
                name = 'dob';
                break;
            case 'Zip Code':
                name = 'zipcode';
                break;
            case 'Password':
                name = 'password';
                break;
            default:
                break;
        }

        return (
            <Box key={name} sx={{ marginLeft: 4 }}>
                <Typography variant='h6'>{_name}</Typography>
                <Typography variant='body1' sx={{ marginLeft: 3 }}>{this.state[name + '_data']}</Typography>
            </Box>
        );
    }
    handleUpdateInputChange(e) {
        this.setState({ [e.target.name]: e.target.value });

        this.setState({ [e.target.name + '_validity']: e.target.value === "" || patterns[e.target.name].test(e.target.value) });
    }
    async handleSubmit(e) {
        e.preventDefault();

        let updateInfo = [];

        for (let name in patterns) {
            let value = this.state[name];

            if (value != "" || name == "password" && this.state.password_confirmation != "") {
                if (name != 'password' && value === this.state[name + '_data']) {
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
                    let array = this.state.dob.split("/");
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

                    if (name != 'password_confirmation') {
                        updateInfo[name] = { name: name, new: this.state[name], old: this.state[name + '_data'] };
                    }
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
            tStr += await axios.put(config.server_url + '/' + name, { [name]: updateInfo[name].new })
                .then(function (response) {
                    if (name == 'password') {
                        let pwd = '';
                        for (let idx = 0; idx < updateInfo[name].new.length; idx++) {
                            pwd += '*';
                        }
                        this.setState({ password_data: pwd, password_confirmation: "" });
                    } else {
                        this.setState({ [name + '_data']: response.data[name] });
                    }
                    this.setState({ [name]: "" });

                    return name.replace(/_/g, ' ') + ', ';
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

                    return '';
                });
        }

        tStr = tStr.substr(0, tStr.length - 2) + '.';

        toast.success(tStr, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    handleImageChange(e) {
        var reader = new FileReader();
        var file = e.target.files[0];

        reader.onloadend = () => {
            const formData = new FormData();
            formData.append('image', file);
            let axioConfig = {
                method: 'put',
                headers: { 'Content-Type': 'multipart/form-data' }
            }

            axios.put(config.server_url + '/avatar', formData, axioConfig).then((response) => {
                this.setState({ avatar: response.data.avatar });
            }).catch((err) => {
                toast.error('Unable to connect server', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            });
        }

        reader.readAsDataURL(file);
    }

    render() {
        return (
            <div>
                <Button onClick={this.jumpMain} sx={{ fontWeight: 'bold', fontSize: 40, borderRadius: 3, paddingLeft: 3, paddingRight: 3, left: 10, top: 20 }} startIcon={<ArrowBackIosNewRounded sx={{ width: 40, height: 40 }} />}>
                    Main
                </Button>

                {/* <Box sx={{ position: 'absolute', right: 400, top: 60 }}> */}
                <Card raised={true} sx={{ position: 'absolute', top: 60, right: 120, width: 160, height: 160, borderRadius: 80 }}>
                    <Avatar alt="avatar" src={this.state.avatar} sx={{ width: 160, height: 160 }} />
                    <label htmlFor="avatar-img-upload">
                        <input accept="image/*" id="avatar-img-upload" type="file" onChange={this.handleImageChange} />
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
                                {['Account Name', 'Email Address', 'Phone Number', 'Date of Birth', 'Zip Code', 'Password'].map((item) => { return this.renderDisplayItem(item); })}
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
                                {/* <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.account_name_validity}
                                    label="Account Name"
                                    name="account_name"
                                    variant="outlined"
                                    // placeholder="Your user name"
                                    value={this.state.account_name}
                                    onChange={this.handleUpdateInputChange}
                                    helperText={!this.state.account_name === '' ? 'Start with character' : ''}
                                /> */}
                                {/* <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.display_name_validity}
                                    label="Display Name (Optional)"
                                    name="display_name"
                                    variant="outlined"
                                    // placeholder="Your display name"
                                    value={this.state.display_name}
                                    onChange={this.handleUpdateInputChange}
                                /> */}
                                <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.email_validity}
                                    label="E-mail Address"
                                    name="email"
                                    variant="outlined"
                                    placeholder="nickname@server"
                                    value={this.state.email}
                                    onChange={this.handleUpdateInputChange}
                                    helperText={!this.state.email_validity ? 'nickname@server' : ''}
                                />
                                <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.phone_validity}
                                    label="Phone Number"
                                    name="phone"
                                    variant="outlined"
                                    placeholder="123-123-1234"
                                    value={this.state.phone}
                                    onChange={this.handleUpdateInputChange}
                                // helperText={!this.state.phone_validity ? 'Required' : ''}
                                />
                                <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.dob_validity}
                                    label="Date of Birth"
                                    name="dob"
                                    variant="outlined"
                                    placeholder="mm/dd/yyyy"
                                    value={this.state.dob}
                                    onChange={this.handleUpdateInputChange}
                                // helperText={!this.state.dob_validity ? 'Required' : ''}
                                />
                                <TextField
                                    size='small' fullWidth={true}
                                    error={!this.state.zipcode_validity}
                                    label="Zip Code"
                                    name="zipcode"
                                    variant="outlined"
                                    placeholder="#### or #####"
                                    value={this.state.zipcode}
                                    onChange={this.handleUpdateInputChange}
                                // helperText={!this.state.zipcode_validity ? 'Required' : ''}
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