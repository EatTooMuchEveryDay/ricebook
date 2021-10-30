import React from 'react';
import { shallow, render, mount } from 'enzyme';
import '@testing-library/jest-dom';
// import { render } from 'enzyme';
// import { render } from '@testing-library/react';

import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'jest-enzyme';

import { Provider } from 'react-redux';
import { createStore } from "redux";
import { ricebookApp } from '../reducers';
import { BrowserRouter as Router, Link, Route, Switch, Redirect, StaticRouter, MemoryRouter } from 'react-router-dom';
import Main from './Main';
import Post from './Post';


configure({ adapter: new Adapter() });


test('logout', () => {
    localStorage.clear();
    localStorage.setItem("username", "Bret");
    localStorage.setItem("loggedIn", true);

    let store = createStore(ricebookApp);

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        </Provider>
    );

    expect(store.getState().username).toEqual('Bret');

    provider.find('Main').at(0).instance().logout();
    expect(store.getState().username).toEqual('');

    provider.unmount();
});

test('fetch all articles for current user', (done) => {
    localStorage.clear();
    localStorage.setItem("username", "Bret");
    localStorage.setItem("loggedIn", true);

    let store = createStore(ricebookApp);

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        </Provider>
    );

    let main = provider.find('Main').at(0).instance();

    setTimeout(() => { let userID = main.state.userID; expect(main.filteredPosts.filter((post) => { return post.userId == userID; }).length).toBeGreaterThanOrEqual(10); done(); provider.unmount(); }, 500);
});

test('filter articles', (done) => {
    localStorage.clear();
    localStorage.setItem("username", "Bret");
    localStorage.setItem("loggedIn", true);

    let store = createStore(ricebookApp);

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        </Provider>
    );

    let main = provider.find('Main').at(0).instance();

    setTimeout(() => {
        let postLength = main.filteredPosts.length;

        main.setState({ searchInput: "tempore" });
        provider.update();

        expect(main.filteredPosts.length).toBeLessThan(postLength);

        done();
        provider.unmount();
    }, 500);
});


test('add follower', (done) => {
    localStorage.clear();
    localStorage.setItem("username", "Bret");
    localStorage.setItem("loggedIn", true);

    let store = createStore(ricebookApp);

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        </Provider>
    );

    let main = provider.find('Main').at(0).instance();

    setTimeout(() => {
        let followerLength = main.state.followers.length;
        let postLength = main.filteredPosts.length;

        main.onFollowInputChange({ target: { value: 'Bret' } });
        main.follow();
        expect(main.state.followers.length).toEqual(followerLength);

        main.onFollowInputChange({ target: { value: 'Antonette' } });
        main.follow();
        expect(main.state.followers.length).toEqual(followerLength);

        main.onFollowInputChange({ target: { value: 'NonexistentUserName' } });
        main.follow();
        expect(main.state.followers.length).toEqual(followerLength);

        main.onFollowInputChange({ target: { value: 'Elwyn.Skiles' } });
        main.follow();
        expect(main.state.followers.length).toEqual(followerLength + 1);

        // for (let i in main.state.users) {
        //     let user = main.state.users[i];
        //     if (user.id != main.state.userID && !main.state.followers.some((follower) => { return follower.id == user.id; })) {
        //         let followers = main.state.followers;
        //         followers.push(user);
        //         main.setState({ followers: followers });
        //         break;
        //     }
        // }
        // provider.update();

        expect(main.filteredPosts.length).toBeGreaterThanOrEqual(postLength);

        done();
        provider.unmount();
    }, 500);
});

test('remove follower', (done) => {
    localStorage.clear();
    localStorage.setItem("username", "Bret");
    localStorage.setItem("loggedIn", true);

    let store = createStore(ricebookApp);

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        </Provider>
    );

    let main = provider.find('Main').at(0).instance();

    setTimeout(() => {
        let postLength = main.filteredPosts.length;
        let followers = main.state.followers;
        let followersLength = main.state.followers.length;
        // followers = followers.splice(0, 1);
        // main.setState({ followers: followers });

        // provider.update();

        main.unfollow(followers[0].username);

        expect(main.state.followers.length).toEqual(followersLength - 1);
        expect(main.filteredPosts.length).toBeLessThan(postLength);

        done();
        provider.unmount();
    }, 500);
});

test('post open comment', (done) => {
    localStorage.clear();
    localStorage.setItem("username", "Bret");
    localStorage.setItem("loggedIn", true);

    let store = createStore(ricebookApp);

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Post />
            </MemoryRouter>
        </Provider>
    );

    setTimeout(() => {
        let post = provider.find('Post').at(0).instance();

        post.commentModeSwitch({ preventDefault: () => { } });
        expect(post.state.commentOpened).toEqual(true);

        post.commentModeSwitch({ preventDefault: () => { } });
        expect(post.state.commentOpened).toEqual(false);

        done();
        provider.unmount();
    }, 500);
});

test('open drawer', () => {
    localStorage.clear();
    localStorage.setItem("username", "Bret");
    localStorage.setItem("loggedIn", true);

    let store = createStore(ricebookApp);

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        </Provider>
    );

    let main = provider.find('Main').at(0).instance();

    main.toggleDrawer(true)({ type: '' });
    provider.update();
    expect(main.state.drawer).toEqual(true);

    main.toggleDrawer(false)({ type: '' });
    provider.update();
    expect(main.state.drawer).toEqual(false);

    provider.unmount();
});

test('update status', () => {
    localStorage.clear();
    localStorage.setItem("username", "Bret");
    localStorage.setItem("loggedIn", true);
    localStorage.setItem("statusList", JSON.stringify({
        'Bret': 'Test Text 1'
    }));

    let store = createStore(ricebookApp);

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        </Provider>
    );

    let main = provider.find('Main').at(0).instance();

    expect(main.state.status).toEqual('Test Text 1');

    main.handleUpdateStatusInputChange({ target: { value: 'Test Text 2' } });
    provider.update();
    main.updateStatus();
    provider.update();
    expect(main.state.status).toEqual('Test Text 2');

    let localStorageStatus = JSON.parse(localStorage.getItem('statusList'))['Bret'];
    expect(localStorageStatus).toEqual('Test Text 2');

    provider.unmount();
});