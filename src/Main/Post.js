import React, { Component } from 'react';
import { Box, Stack, Typography, TextField, Button, Card, CardMedia, Avatar, CardContent, CardActions, Grid } from '@material-ui/core';
import PostImg from '../postImg.JPG';


class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            title: "",
            content: "",
            // timestamp: ""
            commentOpened: false,
            comments: [
                { id: 1, username: "User A", content: "This is a good article!" },
                { id: 2, username: "User B", content: "How amazing!" },
                { id: 3, username: "User C", content: "That's really fun." },
                { id: 4, username: "User D", content: "Great article!" }
            ]
        };

        this.state.username = this.props.username;
        this.state.title = this.props.title;
        this.state.content = this.props.content;

        this.commentModeSwitch = this.commentModeSwitch.bind(this);
    }
    commentModeSwitch(e) { e.preventDefault(); this.setState({ commentOpened: !this.state.commentOpened }); }

    render() {
        return (
            <Grid item xs={5} marginTop={5}>
                <Card sx={{ height: 400 }}>
                    {
                        this.state.commentOpened ? (
                            <Box>
                                <CardContent sx={{ height: 320 }} overflow="scroll">
                                    {this.state.comments.map((comment) => {
                                        return (
                                            <Box marginBottom={2} key={comment.id}>
                                                <Typography noWrap variant="h6">{comment.username}</Typography>
                                                <Typography noWrap textOverflow='ellipsis' variant="body1" marginLeft={2}>{comment.content}</Typography>
                                            </Box>
                                        );
                                    })}
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={this.commentModeSwitch}>Back</Button>
                                </CardActions>
                            </Box>
                        ) : (
                            <Box>
                                <CardMedia
                                    component="img"
                                    alt="post image"
                                    sx={{ height: 200 }}
                                    image={PostImg}
                                />
                                <CardContent>
                                    <Typography noWrap gutterBottom variant="h5" component="div">
                                        {this.state.title}
                                    </Typography>
                                    <Typography noWrap={false} textOverflow='ellipsis' overflow='scroll' component="div" variant="body2" color="text.secondary" sx={{ wordWrap: 'break-word', height: 80 }}>
                                        {this.state.content}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Edit</Button>
                                    <Button size="small" onClick={this.commentModeSwitch}>Comment</Button>
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