import { Router } from "../deps.js";
import * as reportController from "./controllers/reportController.js";
import * as authenticationController from "./controllers/authenticationController.js";
import * as reportApi from "./apis/reportApi.js";
import * as otherPageController from "./controllers/otherPageController.js";
import { oakCors } from "../deps.js";

const router = new Router();

//api endpoints
router.get('/api/summary', oakCors(), reportApi.getSummary);
router.get('/api/summary/:year/:month/:day', oakCors(), reportApi.getSummaryByDate);

//other pages
router.get('/', otherPageController.showFrontPage);

//authentication
router.get('/auth/registration', authenticationController.showRegisterForm);
router.post('/auth/registration', authenticationController.submitRegisterForm);
router.get('/auth/login', authenticationController.showLoginForm);
router.post('/auth/login', authenticationController.submitLoginForm);
router.post('/auth/logout/:user_id', authenticationController.logout);

//reporting
router.get('/behavior/reporting', reportController.showReports);
router.post('/behavior/reporting', reportController.addReport);
router.get('/behavior/summary', reportController.getSummary);


export { router };