import { executeQuery } from "../database/database.js";
import { bcrypt } from "../deps.js";
import {
    validate,
    required,
    isEmail,
    minLength,
    lengthBetween
  } from "../deps.js";


const validationRulesRegister = {
    email: [required, lengthBetween(6, 320), isEmail],
    password: [required, minLength(8)],
    verification: [required, minLength(8)]
};


const registerationData = {
    email: '',
    password: '',
    verification: '',
    errors: null
};


const getRegisterationData = async(request) => {
    if (request) {
        const body = request.body();
        const params = await body.value;

        registerationData.email = params.get('email');
        registerationData.password = params.get('password');
        registerationData.verification = params.get('verification');
    }
    return registerationData;
}


const register = async(request) => {
    const registerationData = await getRegisterationData(request);
    const [passes, errors] = await validate(registerationData, validationRulesRegister);

    if (!passes) {
        registerationData.errors = errors;
    }

    if (registerationData.password !== registerationData.verification) {
        registerationData.errors.verification = {"matches": "passwords did not match"};
    }
    
    const existingUsers = await executeQuery("SELECT * FROM users WHERE email = $1", registerationData.email);
    if (existingUsers.rowCount > 0) {
      registerationData.errors.email = {"isReserved": "email is already reserved"};
    }

    if (!registerationData.errors) {
        const hash = await bcrypt.hash(registerationData.password);
        await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", registerationData.email, hash);
    } else {
        return registerationData;
    }
}


const validationRulesLogin = {
    email: [required],
    password: [required]
};


const authenticationData = {
    email: '',
    password: '',
    errors: null
};


const getAuthenticationData = async(request) => {
    if (request) {
        const body = request.body();
        const params = await body.value;
    
        authenticationData.email = params.get('email');
        authenticationData.password = params.get('password');
    }
    return authenticationData;
}


const login = async(request, session) => {
    const authenticationData = await getAuthenticationData(request);
    const [passes, errors] = await validate(authenticationData, validationRulesLogin);

    if (!passes) {
        authenticationData.errors = errors;
        return authenticationData;
    }

    const res = await executeQuery("SELECT * FROM users WHERE email = $1;", authenticationData.email);
    if (res && res.rowCount === 1) {
        const userObj = res.rowsOfObjects()[0];
        const hash = userObj.password;
    
        const passwordCorrect = await bcrypt.compare(authenticationData.password, hash);
        if (!passwordCorrect) {
            return authenticationData;
        }
    
        await session.set('authenticated', true);
        await session.set('user', {
            id: userObj.id,
            email: userObj.email
        });

    } else {
        return authenticationData;
    }
}

export { register, login };