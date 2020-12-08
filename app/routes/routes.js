import { Router } from "../deps.js";
import { hello } from "./controllers/helloController.js";
import * as helloApi from "./apis/helloApi.js";

const router = new Router();

//api endpoints
router.get('/api/summary', getSummary);
router.get('/api/summary/:year/:month/:day', getSummaryByDate);


router.get('/auth/register', showRegister);
router.post('/auth/register', register);
router.get('/auth/login', showLogin);
router.post('/auth/login', login);
router.post('/auth/logout', logout);

router.get('/behavior/reporting', showReporting);



export { router };