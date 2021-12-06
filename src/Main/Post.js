import React, { PureComponent, Component } from 'react';
import { Box, Stack, Typography, TextField, Button, Card, CardMedia, Avatar, CardContent, CardActions, Grid } from '@material-ui/core';
import PostImg from '../postImg.JPG';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import config from '../config';

axios.defaults.withCredentials = true;

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            commentId: this.props.commentId,
            author: this.props.author,
            articleId: this.props.articleId,
            text: this.props.text,
            textInput: "",
            editOpen: false
        };

        this.editModeSwitch = this.editModeSwitch.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    editModeSwitch(e) {
        e.preventDefault();
        this.setState({ editOpen: !this.state.editOpen, textInput: this.state.text });
    }
    submitEdit(e) {
        e.preventDefault();
        if (this.state.textInput == this.state.text) {
            this.setState({ editOpen: false });
            return;
        }
        if (this.state.textInput == '') {
            toast.error('Say something before you submit', {
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
        axios.put(config.server_url + '/articles/' + this.state.articleId, { commentId: this.state.commentId, text: this.state.textInput })
            .then(function (response) {
                let text = this.state.textInput;
                this.setState({ text: text, editOpen: false, textInput: "" });
                this.props.updateComment(this.state.commentId, text);
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

        // TODO update the post info in parent elements' state
    }
    handleInputChange(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <Box marginBottom={2} key={this.state.commentId}>
                <Typography noWrap variant="h6">{this.state.author}</Typography>
                {
                    this.state.editOpen ?
                        (<Grid display='flex'>
                            {/* <Button size="small" onClick={this.submitEdit} sx={{ float: 'right' }}>Done</Button> */}
                            {/* <Box> */}
                            <TextField
                                hiddenLabel={true}
                                name='textInput'
                                fullWidth={true}
                                float='left'
                                size='small'
                                value={this.state.textInput}
                                onChange={this.handleInputChange}
                                variant="outlined"
                            />
                            {/* </Box> */}
                            <Button size="small" onClick={this.submitEdit} float='right'>Done</Button>
                        </Grid>
                        )
                        :
                        (<Grid>
                            {
                                this.state.author == this.state.username ?
                                    (<Button size="small" onClick={this.editModeSwitch} sx={{ float: 'right' }}>Edit</Button>)
                                    :
                                    (<div></div>)
                            }
                            <Typography noWrap textOverflow='ellipsis' variant="body1" marginLeft={2}>{this.state.text}</Typography>
                        </Grid>)
                }
            </Box>
        );
    }
}

class Post extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            image: "",
            username: "",
            articleId: "",
            author: "",
            title: "",
            text: "",
            textInput: "",
            editOpen: false,
            time: "",
            commentOpened: false,
            comments: [],
            commentInput: ""
        };

        this.state.username = this.props.username;
        this.state.articleId = this.props.articleId;
        this.state.author = this.props.author;
        this.state.title = this.props.title;
        this.state.text = this.props.text;
        this.state.time = this.props.time;
        this.state.comments = this.props.comments;
        this.state.image = this.props.image;

        this.updateComment = this.updateComment.bind(this);

        this.editModeSwitch = this.editModeSwitch.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitEdit = this.submitEdit.bind(this);
        this.commentModeSwitch = this.commentModeSwitch.bind(this);
        this.submitComment = this.submitComment.bind(this);
        this.timestamp2String = this.timestamp2String.bind(this);
    }
    updateComment(commentId, text) {
        // TODO change this with using redux
        let comments = this.state.comments;
        for (let idx in comments) {
            if (comments[idx].id == commentId) {
                comments[idx].text = text;
                this.setState({ comments: comments });
                return;
            }
        }
    }
    editModeSwitch(e) {
        e.preventDefault();
        if (this.state.author != this.state.username) {
            toast.error('You can only edit your own articles!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        this.setState({ editOpen: !this.state.editOpen, textInput: this.state.text });
    }
    handleInputChange(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }
    submitEdit(e) {
        e.preventDefault();

        if (this.state.textInput == this.state.text) {
            this.setState({ editOpen: false });
            return;
        }

        axios.put(config.server_url + '/articles/' + this.state.articleId, { text: this.state.textInput })
            .then(function (response) {
                this.setState({ text: response.data.articles[0].text, editOpen: false });
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
    commentModeSwitch(e) {
        e.preventDefault();
        this.setState({ commentOpened: !this.state.commentOpened });
    }
    submitComment(e) {
        e.preventDefault();
        if (this.state.commentInput == '') {
            toast.error('Say something before you submit', {
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
        axios.put(config.server_url + '/articles/' + this.state.articleId, { commentId: -1, text: this.state.commentInput })
            .then(function (response) {
                this.setState({ comments: response.data.articles[0].comments, commentInput: "" });
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
    timestamp2String() {
        let date = new Date(this.state.time);
        return date.toLocaleString();
    }

    render() {
        return (
            <Grid item xs={5} sx={{ paddingTop: '0px!important', marginBottom: '30px', marginTop: '30px' }}>
                <Card sx={{ height: 400 }}>
                    {
                        this.state.commentOpened ? (
                            <Box>
                                <CardContent sx={{ height: 315, overflow: 'scroll', padding: '0', margin: '16px', marginLeft: '30px', marginRight: '30px' }}>
                                    {this.state.comments.map((comment) => (<Comment key={comment.id} username={this.state.username} author={comment.author} articleId={this.state.articleId} commentId={comment.id} text={comment.text} updateComment={this.updateComment} />))}
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={this.commentModeSwitch}>Back</Button>
                                    <TextField
                                        hiddenLabel
                                        name='commentInput'
                                        fullWidth={true}
                                        size='small'
                                        value={this.state.commentInput}
                                        onChange={this.handleInputChange}
                                        variant="outlined"
                                        placeholder="Your Comment!"
                                    />
                                    <Button size="small" onClick={this.submitComment}>Submit</Button>
                                </CardActions>
                            </Box>
                        ) : (
                            <Box>
                                {
                                    this.state.image == '' ? (<div></div>) :
                                        (<CardMedia
                                            component="img"
                                            alt="post image"
                                            sx={{ height: 200 }}
                                            image={this.state.image}
                                        />)
                                }
                                <CardContent>
                                    <Grid>
                                        <Grid sx={{ float: 'right' }}>
                                            <Typography noWrap gutterBottom variant="body2" color="GrayText" paddingLeft={2} fontSize={12} marginBottom={0} component="div">
                                                {this.timestamp2String()}
                                            </Typography>
                                            <Typography noWrap gutterBottom variant="body1" align="right" fontSize={14} marginBottom={0} component="div">
                                                {'From ' + this.state.author}
                                            </Typography>
                                        </Grid>
                                        <Typography noWrap gutterBottom variant="h5" component="div">
                                            {this.state.title}
                                        </Typography>
                                    </Grid>
                                    {
                                        this.state.editOpen ? (<TextField
                                            label="Content"
                                            name='textInput'
                                            multiline
                                            fullWidth={true}
                                            rows={this.state.image == '' ? '11' : '2'}
                                            // size='small'
                                            sx={this.state.image == '' ? { height: '280px' } : { height: '80px' }}
                                            // height={this.state.image == '' ? '280px' : '80px'}
                                            value={this.state.textInput}
                                            onChange={this.handleInputChange}
                                            variant="filled"
                                        />) :
                                            (<Typography noWrap={false} whiteSpace='pre-line' textOverflow='ellipsis' overflow='scroll' component="div" variant="body1" color="text.secondary" paddingBottom={0} sx={{ wordWrap: 'break-word' }} height={this.state.image == '' ? '280px' : '80px'}>
                                                {this.state.text}
                                            </Typography>)
                                    }
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={this.editModeSwitch}>{this.state.editOpen ? 'Cancel' : 'Edit'}</Button>
                                    {
                                        this.state.editOpen ?
                                            (<Button size="small" onClick={this.submitEdit}>Submit</Button>)
                                            :
                                            (<Button size="small" onClick={this.commentModeSwitch}>Comment</Button>)
                                    }
                                </CardActions>
                            </Box>
                        )
                    }

                </Card>
            </Grid >
        );
    }
}

export default Post;