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
import Profile from './Profile';


configure({ adapter: new Adapter() });



test('should fetch the logged in user', () => {
    localStorage.clear();
    localStorage.setItem("username", "Bret");
    localStorage.setItem("loggedIn", true);

    let store = createStore(ricebookApp);

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        </Provider>
    );

    let profile = provider.find('Profile').at(0).instance();

    expect(profile.state.account_name_data).toEqual('Bret');

    provider.unmount();
});

test('update profile info', (done) => {
    localStorage.clear();
    localStorage.setItem("username", "Bret");
    localStorage.setItem("loggedIn", true);

    let store = createStore(ricebookApp);

    let provider = mount(
        <Provider store={store}>
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        </Provider>
    );

    setTimeout(()=>{
        let profile = provider.find('Profile').at(0).instance();

        profile.handleUpdateInputChange({ target: { name: 'account_name', value: '123' } });
        profile.handleSubmit({ preventDefault: () => { } });
        expect(profile.state.account_name_data).toEqual('Bret');
    
        profile.handleUpdateInputChange({ target: { name: 'account_name', value: 'Bret' } });
        profile.handleSubmit({ preventDefault: () => { } });
        expect(profile.state.account_name_data).toEqual('Bret');
    
        profile.handleUpdateInputChange({ target: { name: 'account_name', value: 'BretNewName' } });
        profile.setState({ password: '123123123' });
        profile.handleSubmit({ preventDefault: () => { } });
        expect(profile.state.account_name_data).toEqual('Bret');
    
        profile.setState({ password_confirmation: '123123123' });
        profile.setState({ date_of_birth: '10/31/2003' });
        profile.handleSubmit({ preventDefault: () => { } });
        expect(profile.state.account_name_data).toEqual('Bret');
    
        profile.setState({ date_of_birth: '01/01/1999' });
        profile.handleSubmit({ preventDefault: () => { } });
        expect(profile.state.account_name_data).toEqual('BretNewName');
    
        provider.unmount();
        done();
    },500);
});
