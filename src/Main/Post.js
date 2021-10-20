import React, { Component } from 'react';
import { Box, Stack, Typography, TextField, Button, Card, CardMedia, Avatar, CardContent, CardActions, Grid } from '@material-ui/core';
import PostImg from '../postImg.jpg';


class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            title: "",
            content: "",
            // timestamp: ""
        };

        this.state.username = this.props.username;
        this.state.title = this.props.title;
        this.state.content = this.props.content;
    }

    render() {
        return (
            <Grid item xs={5} marginTop={5}>
                <Card sx={{ height: 400 }}>
                    <CardMedia
                        component="img"
                        alt="post image"
                        height="200"
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
                        <Button size="small">Comment</Button>
                    </CardActions>
                </Card>
            </Grid>
        );
    }
}

export default Post;