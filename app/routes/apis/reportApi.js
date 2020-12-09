import * as reportService from "../../services/reportService.js";
//import { };
const getSummary = async({response, session}) => {
    //user_id parametrin saa session objectista ---> sessiota ei ole vielä implementoitu
    const user_id = session.get('user_id');
    response.body = await reportService.getReports(user_id);
} 

const getSummaryByDate = async({params, response, session}) => {
    //user_id parametrin saa session objectista ---> sessiota ei ole vielä implementoitu
    const user_id = session.get('user_id')
    const date = `${params.year}-${month}-${day}`;
    response.body = await reportService.getOneReport(user_id, date);
}

//tänne vielä mahdollisesti funktioita, joilla saa myös api-endpointtien kautta
//lisättyä raportteja tietokantaan

export { getSummary, getSummaryByDate };









/*
import * as helloService from "../../services/helloService.js";

const getHello = async({response}) => {
    response.body = { message: await helloService.getHello() };
};

const setHello = async({request, response}) => {
    const body = request.body({type: 'json'});
    const document = await body.value;
    helloService.setHello(document.message);
    response.status = 200;
};
   
export { getHello, setHello };
*/