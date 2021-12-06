import React, { Component } from 'react';
import { Box, Stack, Typography, TextField, Button, Card, CardMedia, Avatar } from '@material-ui/core';
import FollowerAvatar from '../followerAvatar.JPG';

class Follower extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            status: "",
            avatar: ""
        };

        this.state.username = this.props.username;
        this.state.status = this.props.status;
        this.state.avatar = this.props.avatar;

        this.unfollow = this.unfollow.bind(this);
    }
    unfollow(e) {
        this.props.unfollow(this.state.username);
    }

    render() {
        return (
            <Box margin={3} sx={{ ":hover": { marginLeft: 5 }, transition: 'all 1s cubic-bezier(0.19, 1, 0.22, 1)' }}>
                <Card
                    raised={true}
                    sx={{ width: 350, height: 80 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Button size='small' sx={{ position: 'absolute', right: 8, top: 4, fontSize: 8 }} onClick={this.unfollow}>Unfollow</Button>
                    </Box>
                    <Stack direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        marginLeft={2}
                        sx={{ height: '100%' }}
                        spacing={2}>
                        <Avatar alt="followerAvatar" src={this.state.avatar} sx={{ width: 60, height: 60 }} />
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight='bold'
                                component="div">
                                {this.state.username}
                            </Typography>
                            <Box maxWidth={240}>
                                <Typography
                                    variant="p"
                                    noWrap
                                    component="div">
                                    {this.state.status}
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                </Card>
            </Box>
        );
    }
}

export default Follower;