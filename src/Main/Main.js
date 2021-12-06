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
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import { setUsername } from "../actions";
import config from '../config';

axios.defaults.withCredentials = true;

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
            posts: [],
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
            avatarUrl: '',
            imgFile: null
        }
        // this.filteredPosts = [];

        this.checkAuth = this.checkAuth.bind(this);
        // this.getStatusLocalStorage = this.getStatusLocalStorage.bind(this);
        // this.setStatusLocalStorage = this.setStatusLocalStorage.bind(this);
        this.logout = this.logout.bind(this);
        this.jumpProfile = this.jumpProfile.bind(this);
        this.loadUserInfo = this.loadUserInfo.bind(this);
        this.loadPosts = this.loadPosts.bind(this);
        this.filterPosts = this.filterPosts.bind(this);
        // this.filterPostsForTest = this.filterPostsForTest.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.loadFollowing = this.loadFollowing.bind(this);
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
        this.handleImageChange = this.handleImageChange.bind(this);
        this.postArticle = this.postArticle.bind(this);
        this.clearWritingArticleInput = this.clearWritingArticleInput.bind(this);
    }
    componentDidMount() {
        this.checkAuth();
        this.loadUserInfo();
        this.loadFollowing();
        this.loadPosts();
    }
    checkAuth() {
        let loggedIn = localStorage.getItem("loggedIn");
        // this.setState({ username: localStorage.getItem("username") });
        this.props.setUsername(localStorage.getItem("username"));

        if (loggedIn == 'false') {
            this.props.history.push("/welcome");
        } else {
            // this.getStatusLocalStorage();
        }
    }
    // getStatusLocalStorage() {
    //     // TO BE REMOVED

    //     let statusList = localStorage.getItem("statusList");
    //     let username = localStorage.getItem("username");

    //     if (statusList == null || statusList == undefined || statusList == '') {
    //         this.setState({ status: "It is a sunny day!" });

    //         statusList = {};
    //         statusList[username] = "It is a sunny day!";
    //         localStorage.setItem("statusList", JSON.stringify(statusList));
    //         return;
    //     }

    //     statusList = JSON.parse(statusList);

    //     if (statusList[username] == null || statusList[username] == undefined) {
    //         this.setState({ status: "It is a sunny day!" });

    //         statusList[this.props.username] = "It is a sunny day!";
    //         localStorage.setItem("statusList", JSON.stringify(statusList));
    //         return;
    //     }

    //     this.setState({ status: statusList[username] });
    // }
    // setStatusLocalStorage(status) {
    //     // TO BE REMOVED

    //     let statusList = localStorage.getItem("statusList");

    //     if (statusList == null || statusList == undefined || statusList == '') {
    //         statusList = {};
    //     } else {
    //         statusList = JSON.parse(statusList);
    //     }

    //     statusList[this.props.username] = status;
    //     localStorage.setItem("statusList", JSON.stringify(statusList));
    // }
    jumpProfile() {
        this.props.history.push("/profile");
    }
    loadUserInfo() {
        axios.get(config.server_url + '/avatar')
            .then(function (response) {
                this.setState({ avatarUrl: response.data.avatar });
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
        axios.get(config.server_url + '/headline')
            .then(function (response) {
                this.setState({ status: response.data.headline });
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
    loadPosts() {
        axios.get(config.server_url + '/articles')
            .then(function (response) {
                this.setState({ posts: response.data.articles });
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
    filterPosts() {
        let t = this.state.posts.filter((post) => {
            let flag = true;

            if (this.state.searchInput != "") {
                // let re = new RegExp(this.state.searchInput, "i");
                let re = new RegExp(this.state.searchInput.replace(/\\/g,''), "i");

                flag = re.exec(post.title) != null || re.exec(post.author) != null || re.exec(post.text) != null;
            }

            return flag;
        });

        // this.filteredPosts = t;

        return t;
    }
    logout() {
        localStorage.setItem("loggedIn", false);
        this.props.setUsername('');
        // cookie.remove('sid'); // not allowed to modify the httponly cookie. If we want to destroy the cookie after logout, use two cookies combined as credential and destroy the not httponly one
        this.props.history.push("/welcome");
    }
    toggleDrawer = (open) => (event) => {
        if (event != null && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        this.setState({ drawer: open });
    }
    loadFollowing() {
        axios.get(config.server_url + '/following')
            .then(function (response) {
                this.setState({ followers: response.data.following });
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
    unfollow(username) {
        axios.delete(config.server_url + '/following/' + username)
            .then(function (response) {
                this.setState({ followInput: "" });

                this.loadFollowing();
                this.loadPosts();
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
    onFollowInputChange(e) {
        this.setState({ followInput: e.target.value });
    }
    follow() {
        if (this.state.followInput === "") {
            return;
        }

        if(this.state.followInput==this.props.username){
            toast.error('You are always following yourself my dear.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            this.setState({followInput:''});
            return;
        }

        axios.put(config.server_url + '/following/' + this.state.followInput)
            .then(function (response) {
                this.setState({ followInput: "" });
                this.loadFollowing();
                this.loadPosts();
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
        axios.put(config.server_url + '/headline', { headline: this.state.updateStatusInput })
            .then(function (response) {
                this.setState({ status: response.data.headline, updateStatusModalOpen: false });
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
    handleImageChange(e) {
        var reader = new FileReader();
        var file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                imgFile: file
            });
        }

        reader.readAsDataURL(file);
    }
    postArticle() {
        // // post article
        // let newPost = {
        //     "userId": this.state.userID,
        //     "username": this.props.username,
        //     "name": this.state.name,
        //     "id": Math.round(Math.random() * 999999999),
        //     "title": this.state.writeArticleTitleInput,
        //     "body": this.state.writeArticleInput,
        //     "timestamp": (new Date()).getTime()
        // }
        // let posts = this.state.posts;
        // posts.splice(0, 0, newPost);


        const formData = new FormData();
        if (this.state.imgFile != null) {
            formData.append('image', this.state.imgFile);
        }
        formData.append('title', this.state.writeArticleTitleInput);
        formData.append('text', this.state.writeArticleInput);
        let axioConfig = {
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        axios.post(config.server_url + '/article', formData, axioConfig).then((response) => {
            let posts = this.state.posts;
            posts.splice(0, 0, response.data.articles[0]);
            this.setState({ posts: posts, writeArticleTitleInput: "", writeArticleInput: "", writeArticleModalOpen: false, imgFile: null });
        }).catch((err) => {
            toast.error('Unable to connect server', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
        });
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
                                <Follower username={follower.username} status={follower.headline} avatar={follower.avatar} unfollow={this.unfollow} key={follower.username} />
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
                            <Avatar alt="avatar" src={this.state.avatarUrl} sx={{ position: 'absolute', top: 0, left: 0, width: 80, height: 80 }} />
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
                <Grid container justifyContent='space-evenly' columnSpacing={0} rowSpacing={5} marginTop={1}>
                    {this.filterPosts().map((post) => {
                        return (
                            <Post articleId={post.id} username={this.props.username} author={post.author} title={post.title} text={post.text} key={post.id} time={post.time} comments={post.comments} image={post.image} />
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
                                <input accept="image/*" id="write-article-img-upload" type="file" onChange={this.handleImageChange} />
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