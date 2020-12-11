import * as authenticationService from "../../services/authenticationService.js";


const registerData = {
    email: '',
    password: '',
    verification: '',
    errors: null
};


const loginData = {
    email: '',
    password: '',
    authentication: '',
    errors: null
};


const showRegisterForm = ({render}) => {
    render('register.ejs', registerData);
}


const showLoginForm = ({render}) => {
    render('login.ejs', loginData);
}


const submitRegisterForm = async({request, response, render}) => {
    const result = await authenticationService.register(request);
    if (result) {
        render('register.ejs', result);
    } else {
        response.status = 200;
        response.body = 'Registration successful!';
    }
}


const submitLoginForm = async({request, response, render, session}) => {
    const result = await authenticationService.login(request, session);
    if (result) {
        render('login.ejs', result);
    } else {
        response.status = 200;
        response.redirect('/landing');
    }
}


const logout = async({response, params, session}) => {
    await session.set('authenticated', false);
    await session.set('user', null);

    response.status = 200;
    response.body = 'Logged out successfully';
}

export { showRegisterForm, showLoginForm, submitLoginForm, submitRegisterForm, logout };