import { Router } from "../deps.js";
import * as reportController from "./controllers/reportController.js";
import * as authenticationController from "./controllers/authenticationController.js";
import * as reportApi from "./apis/reportApi.js";
import { showFrontPage } from "./controllers/frontPageController.js";

const router = new Router();

//api endpoints
router.get('/api/summary', reportApi.getSummary);
router.get('/api/summary/:year/:month/:day', reportApi.getSummaryByDate);

//authentication
router.get('/', showFrontPage);
router.get('/auth/register', authenticationController.showRegisterForm);
router.post('/auth/register', authenticationController.register);
router.get('/auth/login', authenticationController.showLoginForm);
router.post('/auth/login', authenticationController.login);
router.post('/auth/logout', authenticationController.logout);

//reporting
router.get('/behavior/reporting', reportController.showReports);
router.post('behavior/reporting', reportController.addReport);
router.get('/behavior/summary', reportController.getSummary);//ei ole vielä tehty


export { router };