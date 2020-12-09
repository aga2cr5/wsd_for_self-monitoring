import { executeQuery } from "../database/database.js";
import { bcrypt } from "../deps.js";

const register = async(email, password, verification) => {
    if (password !== verification) {
        return 'The entered passwords did not match';
    }
    
    const existingUsers = await executeQuery("SELECT * FROM users WHERE email = $1", email);
    if (existingUsers.rowCount > 0) {
      return 'The email is already reserved.';
    }

    const hash = await bcrypt.hash(password);
    await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
}


const authenticate = async(email, password, session) => {
    //tarkistaa löytyykö sähköposti tietokannasta
    const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
    if (res.rowCount === 0) {
        return '';
    }

    const userObj = res.rowsOfObjects()[0];
    const hash = userObj.password;

    const passwordCorrect = await bcrypt.compare(password, hash);
    if (!passwordCorrect) {
        return '';
    }

    await session.set('authenticated', true);
    await session.set('user', {
        id: userObj.id,
        email: userObj.email
    });
}

export { register, authenticate };