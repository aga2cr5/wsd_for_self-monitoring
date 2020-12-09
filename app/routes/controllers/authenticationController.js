import * as authenticationService from "../../services/authenticationService.js";

const showRegisterForm = ({render}) => {
    render('register.ejs');
}

const showLoginForm = ({render}) => {
    render('login.ejs');
}

const register = async({request, response}) => {
    const body = request.body();
    const params = await body.value;

    const email = params.get('email');
    const password = params.get('password');
    const verification = params.get('verification');

    const result = await authenticationService.register(email, password, verification);
    if (result) {
        response.body = result;
    } else {
        response.status = 200;
        response.body = 'Registration successful!';
    }
}


const login = async({request, response, session}) => {
    const body = request.body();
    const params = await body.value;

    const email = params.get('email');
    const password = params.get('password');

    const result = await authenticationService.authenticate(email, password, session);
    if (result) {
        response.status = 401;
        response.body = 'Authentication was not successful'
    } else {
        response.redirect('/behavior/reporting');
    }
}


//tässä kohtaa funktio, jolla voi kirjata itsensä ulos sovelluksesta.
//ei vielä päätetty täysin mihin päätyy siitä, joten laitetaan menemään root kansioon

//tässä kokeillaan ensimmäistä kertaa sleep funktiota. jos toimii lisätään
//muuallekin redirect kohtiin
const logout = async({response, session}) => {
    await session.set('authenticated', false);

    response.status = 200;
    response.body = 'Logged out successfully';

    //lisää tähän joku sleep funktio ja sitten redirect
    //response.redirect('/');
}

export { showRegisterForm, showLoginForm, login, register, logout };