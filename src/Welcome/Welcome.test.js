import React from 'react';
import { shallow, render, mount } from 'enzyme';
import '@testing-library/jest-dom';
// import { render } from 'enzyme';
// import { render } from '@testing-library/react';
import Welcome from './Welcome';
import { Provider } from 'react-redux';
import { createStore } from "redux";
import { ricebookApp } from '../reducers';
import { BrowserRouter as Router, Link, Route, Switch, Redirect, StaticRouter, MemoryRouter } from 'react-router-dom';
import { setUsername } from '../actions';

import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'jest-enzyme';


configure({ adapter: new Adapter() });



test('logged in user', () => {
    localStorage.clear();
    localStorage.setItem("username", "Bret");
    localStorage.setItem("loggedIn", true);

    let store = createStore(ricebookApp);

    expect(store.getState().username).toEqual('');

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Welcome />
            </MemoryRouter>
        </Provider>
    );

    expect(store.getState().username).toEqual('Bret');//.prop('username')).toEqual("Bret");
    provider.unmount();
});

test('no logged in user', () => {
    localStorage.clear();

    let store = createStore(ricebookApp);

    expect(store.getState().username).toEqual('');

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Welcome />
            </MemoryRouter>
        </Provider>
    );

    expect(store.getState().username).toEqual('');
    provider.unmount();
});

test('log in placeholder user', (done) => {
    localStorage.clear();
    let store = createStore(ricebookApp);

    expect(store.getState().username).toEqual("");

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Welcome />
            </MemoryRouter>
        </Provider>
    );

    let loginInstance = provider.find('Login').instance();
    provider.find('input').at(0).simulate('change', { target: { name: 'account_name', value: 'Bret' } });
    provider.find('input').at(1).simulate('change', { target: { name: 'password', value: 'Kulas Light' } });
    loginInstance.handleSubmit({ preventDefault: () => { } });

    setTimeout(() => { expect(store.getState().username).toEqual('Bret'); done(); provider.unmount() }, 500);
});

test('log in invalid user', (done) => {
    localStorage.clear();

    let store = createStore(ricebookApp);

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Welcome />
            </MemoryRouter>
        </Provider>
    );

    let loginInstance = provider.find('Login').instance();
    loginInstance.setState({ account_name: "Invalid User", password: "Invalid Password" });
    loginInstance.handleSubmit({ preventDefault: () => { } });

    setTimeout(() => { expect(store.getState().username).toEqual(''); done(); provider.unmount() }, 500);
});

test('invalid input submit', () => {
    localStorage.clear();
    let store = createStore(ricebookApp);

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Welcome />
            </MemoryRouter>
        </Provider>
    );

    provider.find('input').at(0).simulate('change', { target: { name: 'account_name', value: '' } });
    provider.find('input').at(1).simulate('change', { target: { name: 'password', value: '' } });
    let loginInstance = provider.find('Login').instance();
    // loginInstance.setState({ account_name: "Invalid User", password: "Invalid Password" });
    loginInstance.handleSubmit({ preventDefault: () => { } });

    expect(store.getState().username).toEqual('');
    provider.unmount();
});

test('register a new user', (done) => {
    localStorage.clear();
    let store = createStore(ricebookApp);

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Welcome />
            </MemoryRouter>
        </Provider>
    );
    
    let registerInstance = provider.find('Register').instance();
    provider.find('input').at(2).simulate('change', { target: { name: 'account_name', value: '' } });
    registerInstance.setState({
        email_address: 'owl@rice.edu',
        phone_number: '123-123-1234',
        date_of_birth: '10/31/2003',
        zip_code: '12345',
        password: '123123123',
        password_confirmation: ''
    });
    registerInstance.handleSubmit({ preventDefault: () => { } });
    expect(store.getState().username).toEqual('');

    provider.find('input').at(2).simulate('change', { target: { name: 'account_name', value: 'UserName' } });
    registerInstance.handleSubmit({ preventDefault: () => { } });
    expect(store.getState().username).toEqual('');

    registerInstance.setState({ password_confirmation: '123123123' });
    registerInstance.handleSubmit({ preventDefault: () => { } });
    expect(store.getState().username).toEqual('');

    registerInstance.setState({ date_of_birth: '01/01/2000' });
    registerInstance.handleSubmit({ preventDefault: () => { } });

    setTimeout(() => { expect(store.getState().username).toEqual('UserName'); done(); provider.unmount(); }, 500);
});