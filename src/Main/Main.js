import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Box, AppBar, styled, alpha, Toolbar, IconButton, Button, Typography, Avatar, InputBase, SwipeableDrawer, Card, Stack, TextField, Grid, Modal } from '@material-ui/core';
import { Menu, More, Search as SearchIcon, Create, Logout, Settings, Group, Add, Check, Delete, Close, Image, TurnedIn } from '@material-ui/icons';
import './Main.css';
import avatar from '../avatar.JPG';
import Follower from './Follower';
import Post from './Post';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import { setUsername } from "../actions"


const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    alignItems: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    // Override media queries injected by theme.mixins.toolbar
    '@media all': {
        minHeight: 100,
    },
}));

const Search = styled('div')(({ theme }) => ({
    // position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    // marginRight: theme.spacing(2),
    // marginLeft: 0,
    // width: '100%',
    // [theme.breakpoints.up('sm')]: {
    //     marginLeft: theme.spacing(3),
    //     width: 'auto',
    // },
    position: 'absolute', left: 60, bottom: 10, right: 260
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        // position: 'absolute',
        // left: 0,
        // right: 0,
        // top: 0,
        // bottom: 0,
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        // width: 500,
        // [theme.breakpoints.up('md')]: {
        //     width: '20ch',
        // },
    },
}));

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: -1,
            users: [], // TO BE REMOVED
            posts: [], // TO BE REMOVED?
            followers: [],
            drawer: false,
            followInput: "",
            searchInput: "",
            updateStatusModalOpen: false,
            status: "",
            updateStatusInput: "",
            writeArticleModalOpen: false,
            writeArticleTitleInput: "",
            writeArticleInput: "",
            // filteredPosts: []
        }
        this.filteredPosts = [];
        this.cancel = null;

        this.checkAuth = this.checkAuth.bind(this);
        this.getStatusLocalStorage = this.getStatusLocalStorage.bind(this);
        this.setStatusLocalStorage = this.setStatusLocalStorage.bind(this);
        this.logout = this.logout.bind(this);
        this.jumpProfile = this.jumpProfile.bind(this);
        this.loadUsers = this.loadUsers.bind(this);
        this.loadPosts = this.loadPosts.bind(this);
        this.filterPosts = this.filterPosts.bind(this);
        // this.filterPostsForTest = this.filterPostsForTest.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.unfollow = this.unfollow.bind(this);
        this.onFollowInputChange = this.onFollowInputChange.bind(this);
        this.follow = this.follow.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.openUpdateStatusModal = this.openUpdateStatusModal.bind(this);
        this.handleCloseUpdateStatusModal = this.handleCloseUpdateStatusModal.bind(this);
        this.handleUpdateStatusInputChange = this.handleUpdateStatusInputChange.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.clearUpdateStatusInput = this.clearUpdateStatusInput.bind(this);
        this.openWriteArticleModal = this.openWriteArticleModal.bind(this);
        this.handleCloseWriteArticleModal = this.handleCloseWriteArticleModal.bind(this);
        this.handleWriteArticleTitleInputChange = this.handleWriteArticleTitleInputChange.bind(this);
        this.handleWriteArticleInputChange = this.handleWriteArticleInputChange.bind(this);
        this.postArticle = this.postArticle.bind(this);
        this.clearWritingArticleInput = this.clearWritingArticleInput.bind(this);
    }
    componentDidMount() {
        this.checkAuth();
        this.loadUsers();
    }
    componentWillUnmount() {
        // Just for test
        this.cancel();
    }
    checkAuth() {
        let loggedIn = localStorage.getItem("loggedIn");
        // this.setState({ username: localStorage.getItem("username") });
        this.props.setUsername(localStorage.getItem("username"));

        if (loggedIn == 'false') {
            this.props.history.push("/welcome");
        } else {
            this.getStatusLocalStorage();
        }
    }
    getStatusLocalStorage() {
        // TO BE REMOVED

        let statusList = localStorage.getItem("statusList");
        let username = localStorage.getItem("username");

        if (statusList == null || statusList == undefined || statusList == '') {
            this.setState({ status: "It is a sunny day!" });

            statusList = {};
            statusList[username] = "It is a sunny day!";
            localStorage.setItem("statusList", JSON.stringify(statusList));
            return;
        }

        statusList = JSON.parse(statusList);

        if (statusList[username] == null || statusList[username] == undefined) {
            this.setState({ status: "It is a sunny day!" });

            statusList[this.props.username] = "It is a sunny day!";
            localStorage.setItem("statusList", JSON.stringify(statusList));
            return;
        }

        this.setState({ status: statusList[username] });
    }
    setStatusLocalStorage(status) {
        // TO BE REMOVED

        let statusList = localStorage.getItem("statusList");

        if (statusList == null || statusList == undefined || statusList == '') {
            statusList = {};
        } else {
            statusList = JSON.parse(statusList);
        }

        statusList[this.props.username] = status;
        localStorage.setItem("statusList", JSON.stringify(statusList));
    }
    jumpProfile() {
        this.props.history.push("/profile");
    }
    loadUsers() {
        let self = this;
        axios.get('https://jsonplaceholder.typicode.com/users',
            {
                cancelToken: new axios.CancelToken(function executor(c) {
                    self.cancel = c;
                })
            })
            .then(function (response) {
                if (this.componentWillUnmount)
                    this.setState({ users: response.data });

                for (let idx in response.data) {
                    let user = response.data[idx];
                    if (user.username === this.props.username) {
                        this.setState({ userID: user.id });
                    }
                }

                // TO BE REMOVED
                let userID = this.state.userID;
                let followers = [];
                if (userID < 0) {
                    userID = 0;
                    followers.push(this.state.users[0]);
                    this.setState({ name: "newRegisteredName" });
                } else {
                    for (let i = 0, j = userID + 1; i < 3; i++, j++) {
                        j = (j > 10 ? j - 10 : j);
                        followers.push(this.state.users[j - 1]);
                    }
                }

                this.setState({ followers: followers });

                this.loadPosts(response.data);
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
    loadPosts(users) {
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(function (response) {
                for (let idx in response.data) {
                    response.data[idx].timestamp = Math.round(Math.random() * 31536000000.0) + 1577808000000;
                    response.data[idx].username = users[response.data[idx].userId - 1].username;
                    response.data[idx].name = users[response.data[idx].userId - 1].name;
                }
                // // TO BE REMOVED
                // if (this.state.userID < 0) {
                //     [{
                //         "userId": this.state.userID,
                //         "id": Math.round(Math.random() * 999999999),
                //         "title": "Random Title 1",
                //         "body": "Random Body 1",
                //         username: this.props.username,
                //         name: this.state.name,
                //         timestamp: Math.round(Math.random() * 31536000000.0) + 1577808000000
                //     },
                //     {
                //         "userId": this.state.userID,
                //         "id": Math.round(Math.random() * 999999999),
                //         "title": "Random Title 2",
                //         "body": "Random Body 2",
                //         username: this.props.username,
                //         name: this.state.name,
                //         timestamp: Math.round(Math.random() * 31536000000.0) + 1577808000000
                //     },
                //     {
                //         "userId": this.state.userID,
                //         "id": Math.round(Math.random() * 999999999),
                //         "title": "Random Title 3",
                //         "body": "Random Body 3",
                //         username: this.props.username,
                //         name: this.state.name,
                //         timestamp: Math.round(Math.random() * 31536000000.0) + 1577808000000
                //     },
                //     {
                //         "userId": this.state.userID,
                //         "id": Math.round(Math.random() * 999999999),
                //         "title": "Random Title 4",
                //         "body": "Random Body 4",
                //         username: this.props.username,
                //         name: this.state.name,
                //         timestamp: Math.round(Math.random() * 31536000000.0) + 1577808000000
                //     },
                //     {
                //         "userId": this.state.userID,
                //         "id": Math.round(Math.random() * 999999999),
                //         "title": "Random Title 5",
                //         "body": "Random Body 5",
                //         username: this.props.username,
                //         name: this.state.name,
                //         timestamp: Math.round(Math.random() * 31536000000.0) + 1577808000000
                //     },
                //     {
                //         "userId": this.state.userID,
                //         "id": Math.round(Math.random() * 999999999),
                //         "title": "Random Title 6",
                //         "body": "Random Body 6",
                //         username: this.props.username,
                //         name: this.state.name,
                //         timestamp: Math.round(Math.random() * 31536000000.0) + 1577808000000
                //     },
                //     {
                //         "userId": this.state.userID,
                //         "id": Math.round(Math.random() * 999999999),
                //         "title": "Random Title 7",
                //         "body": "Random Body 7",
                //         username: this.props.username,
                //         name: this.state.name,
                //         timestamp: Math.round(Math.random() * 31536000000.0) + 1577808000000
                //     },
                //     {
                //         "userId": this.state.userID,
                //         "id": Math.round(Math.random() * 999999999),
                //         "title": "Random Title 8",
                //         "body": "Random Body 8",
                //         username: this.props.username,
                //         name: this.state.name,
                //         timestamp: Math.round(Math.random() * 31536000000.0) + 1577808000000
                //     },
                //     {
                //         "userId": this.state.userID,
                //         "id": Math.round(Math.random() * 999999999),
                //         "title": "Random Title 9",
                //         "body": "Random Body 9",
                //         username: this.props.username,
                //         name: this.state.name,
                //         timestamp: Math.round(Math.random() * 31536000000.0) + 1577808000000
                //     },
                //     {
                //         "userId": this.state.userID,
                //         "id": Math.round(Math.random() * 999999999),
                //         "title": "Random Title 10",
                //         "body": "Random Body 10",
                //         username: this.props.username,
                //         name: this.state.name,
                //         timestamp: Math.round(Math.random() * 31536000000.0) + 1577808000000
                //     }
                //     ].forEach((x) => { response.data.push(x) });
                // }

                response.data.sort((a, b) => { return b.timestamp - a.timestamp });

                this.setState({ posts: response.data });

                // setTimeout(this.filterPostsForTest.bind(this), 200);
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

        // this.filterPosts();
    }
    // filterPostsForTest(input) {
    //     // by follower, by self, by search
    //     let t = this.state.posts.filter((post) => {
    //         // if (this.state.searchInput != "") {

    //         let flag = this.state.followers.some((follower) => { return follower.id === post.userId; }) || this.state.userID == post.userId;
    //         if (flag && input == "") {
    //             // let re = new RegExp(this.state.searchInput, "i");
    //             let re = new RegExp(input, "i");

    //             flag = re.exec(post.title) != null || re.exec(post.name) != null || re.exec(post.username) != null || re.exec(post.body) != null;
    //         }

    //         return flag;
    //     });

    //     this.setState({ filteredPosts: t });

    //     // return t;
    // }
    filterPosts() {
        // by follower, by self, by search
        let t = this.state.posts.filter((post) => {
            // if (this.state.searchInput != "") {

            let flag = this.state.followers.some((follower) => { return follower.id === post.userId; }) || this.state.userID == post.userId;
            if (flag && this.state.searchInput != "") {
                // let re = new RegExp(this.state.searchInput, "i");
                let re = new RegExp(this.state.searchInput, "i");

                flag = re.exec(post.title) != null || re.exec(post.name) != null || re.exec(post.username) != null || re.exec(post.body) != null;
            }

            return flag;
        });

        this.filteredPosts = t;

        return t;
    }
    logout() {
        localStorage.setItem("loggedIn", false);
        this.props.setUsername('');
        this.props.history.push("/welcome");
    }
    toggleDrawer = (open) => (event) => {
        if (event != null && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        this.setState({ drawer: open });
    }
    unfollow(username) {
        let followers = this.state.followers;
        for (let idx in followers) {
            if (followers[idx].username === username) {
                followers.splice(idx, 1);
                this.setState({ followers: followers });

                return;
            }
        }
    }
    onFollowInputChange(e) {
        this.setState({ followInput: e.target.value });
    }
    follow() {
        if (this.state.followInput === "") {
            return;
        }

        let user = this.state.users.find((x) => { return x.username === this.state.followInput });

        if (user == null) {
            toast.error('User not found', {
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

        if (user.id == this.state.userID) {
            toast.error('You can not follow yourself', {
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

        if (this.state.followers.some((x) => { return x.id == user.id })) {
            toast.error('You have already followed him/her', {
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

        // let newFollower = {
        //     "id": user.id,//Math.round(Math.random() * 999999999),
        //     "name": this.state.followInput,
        //     "username": this.state.followInput,
        //     "company": {
        //         "catchPhrase": this.state.followInput + " has something to say",
        //     }
        // };
        let followers = this.state.followers;
        followers.push(user);
        this.setState(followers);
        this.setState({ followInput: "" });
    }
    handleSearchInputChange(e) {
        // this.props.filteredPosts = e.target.value;
        this.setState({ searchInput: e.target.value });
    }
    openUpdateStatusModal(e) {
        this.setState({ updateStatusModalOpen: true });
    }
    handleCloseUpdateStatusModal(e) {
        this.setState({ updateStatusModalOpen: false });
    }
    handleUpdateStatusInputChange(e) {
        this.setState({ updateStatusInput: e.target.value });
    }
    updateStatus() {
        this.setState({ status: this.state.updateStatusInput, updateStatusModalOpen: false });

        // TO BE REMOVED
        this.setStatusLocalStorage(this.state.updateStatusInput);

        this.clearUpdateStatusInput();
    }
    clearUpdateStatusInput() {
        this.setState({ updateStatusInput: "" });
    }
    openWriteArticleModal(e) {
        this.setState({ writeArticleModalOpen: true });
    }
    handleCloseWriteArticleModal(e) {
        this.setState({ writeArticleModalOpen: false });
    }
    handleWriteArticleTitleInputChange(e) {
        this.setState({ writeArticleTitleInput: e.target.value });
    }
    handleWriteArticleInputChange(e) {
        this.setState({ writeArticleInput: e.target.value });
    }
    postArticle() {
        // post article
        let newPost = {
            "userId": this.state.userID,
            "username": this.props.username,
            "name": this.state.name,
            "id": Math.round(Math.random() * 999999999),
            "title": this.state.writeArticleTitleInput,
            "body": this.state.writeArticleInput,
            "timestamp": (new Date()).getTime
        }
        let posts = this.state.posts;
        posts.splice(0, 0, newPost);

        this.setState({ posts: posts, writeArticleTitleInput: "", writeArticleInput: "", writeArticleModalOpen: false });
    }
    clearWritingArticleInput() {
        this.setState({ writeArticleTitleInput: "", writeArticleInput: "" });
    }

    render() {
        return (
            <Box>
                <SwipeableDrawer
                    open={this.state.drawer}
                    onClose={this.toggleDrawer(false)}
                    onOpen={this.toggleDrawer(true)}
                    // backgroundColor='transparent'
                    ModalProps={{
                        keepMounted: true,
                    }}
                    // hideBackdrop={true}
                    elevation={0}
                    PaperProps={{
                        sx: {
                            backgroundColor: 'transparent',
                            // height: 'auto',
                            scrollbarWidth: 'none' // does not work
                        }
                    }}
                >
                    <Typography
                        variant='h3'
                        component="div"
                        color='#ffffff'
                        paddingTop={2}
                        paddingLeft={3}
                    >
                        Followers
                    </Typography>
                    <Box marginLeft={3}>
                        <Stack direction="row"
                            justifyContent="flex-start">
                            <Card
                                raised={true}
                                sx={{ width: 280, height: 40, borderRadius: 20, backgroundColor: '#ffffff44', ":hover": { backgroundColor: '#ffffffaa' }, transition: 'background-color 0.6s cubic-bezier(0.19, 1, 0.22, 1)' }}>
                                <input className="add-follower-input" value={this.state.followInput} onChange={this.onFollowInputChange} />
                            </Card>
                            <IconButton aria-label="follow" onClick={this.follow} sx={{ marginLeft: 2, width: 40, height: 40, backgroundColor: '#ffffff44', ":hover": { backgroundColor: '#ffffff88' } }}>
                                <Add sx={{ color: '#ffffffcc' }} />
                            </IconButton>
                        </Stack>
                    </Box>
                    <Box>
                        {this.state.followers.map((follower) => {
                            return (
                                <Follower username={follower.username} name={follower.name} userID={follower.id} status={follower.company.catchPhrase} unfollow={this.unfollow} key={follower.id} />
                            );
                        })}
                        {/* <Follower username="aNewFollower1" status="NewFollwer'sStatus1" unfollow={this.unfollow} />
                        <Follower username="aNewFollower2" status="NewFollwer'sStatus2" unfollow={this.unfollow} />
                        <Follower username="aNewFollower3" status="NewFollwer'sStatus3" unfollow={this.unfollow} />
                        <Follower username="aNewFollower4" status="NewFollwer'sStatus4" unfollow={this.unfollow} /> */}
                    </Box>
                </SwipeableDrawer>
                <AppBar className="app-bar" position="sticky">
                    <StyledToolbar >
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2, backgroundColor: '#ffffff22' }}
                            onClick={this.toggleDrawer(true)}
                        >
                            <Group />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            edge="start"
                            sx={{ marginLeft: 2, marginRight: 5, fontWeight: 'bold' }}
                        >
                            {this.props.username}
                        </Typography>
                        <Box>
                            <Button onClick={this.openUpdateStatusModal} size='small' sx={{ paddingLeft: 2, paddingRight: 2, fontSize: 10, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#ffffff18', ":hover": { backgroundColor: '#00000033' } }}>Update Status</Button>
                        </Box>
                        <Box sx={{ position: 'absolute', left: 100, top: 40, right: 260 }}>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                textOverflow='ellipsis'
                            >
                                {this.state.status}
                            </Typography>
                        </Box>
                        {/* <Box sx={{position: 'absolute',left: 60, bottom: 10, right: 260}}> */}
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                fullWidth
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                value={this.state.searchInput}
                                onChange={this.handleSearchInputChange}
                            />
                        </Search>
                        {/* </Box> */}

                        <Box sx={{ position: 'absolute', right: 170, top: 20, ":hover": { top: 17, boxShadow: '0 5 12 0 #dddddd' }, transition: 'top 1s cubic-bezier(0.19, 1, 0.22, 1)' }}>
                            <Avatar alt="avatar" src={avatar} sx={{ position: 'absolute', top: 0, left: 0, width: 80, height: 80 }} />
                            <IconButton onClick={this.jumpProfile} sx={{ position: 'absolute', top: 0, left: 0, width: 80, height: 80, color: 'transparent', ":hover": { color: '#ffffffcc', boxShadow: '0px 4px 4px 0px #00000055' }, transition: 'boxShadow 0.8s cubic-bezier(0.19, 1, 0.22, 1)' }}>
                                <Settings sx={{ fontSize: 50, opacity: 0.75 }} />
                            </IconButton>
                        </Box>
                        <Typography variant="span" sx={{ position: 'absolute', right: 60, top: 100 }}>click me ↑ to profile</Typography>

                        <Box sx={{ position: 'absolute', right: 70, top: 35 }}>
                            <IconButton onClick={this.logout} sx={{ position: 'absolute', top: 0, left: 0, width: 50, height: 50, backgroundColor: '#ffffff22' }}>
                                <Logout sx={{ fontSize: 24, color: '#ffffff' }} />
                            </IconButton>
                        </Box>
                        <Box sx={{ position: 'absolute', right: 240, top: 35 }}>
                            <IconButton onClick={this.openWriteArticleModal} sx={{ position: 'absolute', top: 0, left: 0, width: 50, height: 50, backgroundColor: '#ffffff22' }}>
                                <Create sx={{ fontSize: 24, color: '#ffffff' }} />
                            </IconButton>
                        </Box>

                    </StyledToolbar>
                </AppBar>

                {/* <Stack
                    width='100%'
                    height='100%'
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={2}
                > */}
                {/* <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={2}
                    > */}
                <Grid container justifyContent='space-evenly' columnSpacing={0} rowSpacing={5} >
                    {this.filterPosts().map((post) => {
                        return (
                            <Post username={null} title={post.title} content={post.body} key={post.id} />
                        );
                    })}
                    {/* <Post username="username1" title="title1" content="content1" />
                    <Post username="username2" title="title2" content="content2" />
                    <Post username="username3" title="title3" content="content3" />
                    <Post username="username4" title="title4" content="content4" />
                    <Post username="username5" title="title5" content="content5" />
                    <Post username="username6" title="title6" content="content6" /> */}
                </Grid>
                {/* </Stack> */}
                {/* </Stack> */}

                <Modal
                    open={this.state.updateStatusModalOpen}
                    onClose={this.handleCloseUpdateStatusModal}
                // aria-labelledby="modal-modal-title"
                // aria-describedby="modal-modal-description"
                >
                    <Box>
                        <Card raised={true} sx={{ position: 'absolute', top: '50%', left: '50%', width: 400, minHeight: 280, transform: 'translate(-50%, -50%)' }}>
                            <TextField
                                label="Status"
                                multiline
                                fullWidth={true}
                                rows={11}
                                value={this.state.updateStatusInput}
                                onChange={this.handleUpdateStatusInputChange}
                                variant="filled"
                                placeholder="click anywhere to cancel"
                            />
                        </Card>
                        <Box sx={{ position: 'absolute', top: 'calc( 50% - 60px - 25px )', left: 'calc( 50% + 250px - 25px )' }}>
                            <IconButton onClick={this.updateStatus} sx={{ position: 'absolute', top: 0, left: 0, width: 50, height: 50, backgroundColor: '#ffffff22' }}>
                                <Check sx={{ fontSize: 24, color: '#ffffff' }} />
                            </IconButton>
                        </Box>
                        <Box sx={{ position: 'absolute', top: 'calc( 50% + 60px - 25px )', left: 'calc( 50% + 250px - 25px )' }}>
                            <IconButton onClick={this.clearUpdateStatusInput} sx={{ position: 'absolute', top: 0, left: 0, width: 50, height: 50, backgroundColor: '#ffffff22' }}>
                                <Delete sx={{ fontSize: 24, color: '#ffffff' }} />
                            </IconButton>
                        </Box>
                    </Box>
                </Modal>

                <Modal
                    open={this.state.writeArticleModalOpen}
                    onClose={this.handleCloseWriteArticleModal}
                // aria-labelledby="modal-modal-title"
                // aria-describedby="modal-modal-description"
                >
                    <Box>
                        <Card raised={true} sx={{ position: 'absolute', top: 'calc( 50% - 40px - 180px )', left: 'calc( 50% - 200px )', width: 400, height: '56px' }}>
                            <TextField
                                label="Title"
                                fullWidth={true}
                                value={this.state.writeArticleTitleInput}
                                onChange={this.handleWriteArticleTitleInputChange}
                                variant="filled"
                                placeholder="click anywhere to cancel"
                            />
                        </Card>
                        <Card raised={true} sx={{ position: 'absolute', top: '50%', left: '50%', width: 400, minHeight: 280, transform: 'translate(-50%, -50%)' }}>
                            <TextField
                                label="Content"
                                multiline
                                fullWidth={true}
                                rows={11}
                                value={this.state.writeArticleInput}
                                onChange={this.handleWriteArticleInputChange}
                                variant="filled"
                                placeholder="click anywhere to cancel"
                            />
                        </Card>
                        <Box sx={{ position: 'absolute', top: 'calc( 50% - 60px - 25px )', left: 'calc( 50% + 250px - 25px )' }}>
                            <IconButton onClick={this.postArticle} sx={{ position: 'absolute', top: 0, left: 0, width: 50, height: 50, backgroundColor: '#ffffff22' }}>
                                <Check sx={{ fontSize: 24, color: '#ffffff' }} />
                            </IconButton>
                        </Box>
                        <Box sx={{ position: 'absolute', top: 'calc( 50% + 60px - 25px )', left: 'calc( 50% + 250px - 25px )' }}>
                            <IconButton onClick={this.clearWritingArticleInput} sx={{ position: 'absolute', top: 0, left: 0, width: 50, height: 50, backgroundColor: '#ffffff22' }}>
                                <Delete sx={{ fontSize: 24, color: '#ffffff' }} />
                            </IconButton>
                        </Box>
                        <Box sx={{ position: 'absolute', top: 'calc( 50% - 25px )', left: 'calc( 50% + 300px - 25px )' }}>
                            <label htmlFor="write-article-img-upload">
                                <input accept="image/*" id="write-article-img-upload" type="file" />
                                <IconButton sx={{ position: 'absolute', top: 0, left: 0, width: 50, height: 50, backgroundColor: '#ffffff22' }} component="span">
                                    <Image sx={{ fontSize: 24, color: '#ffffff' }} />
                                </IconButton>
                            </label>
                        </Box>
                    </Box>
                </Modal>
            </Box >
        )
    };
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main));