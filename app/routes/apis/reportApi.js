import * as reportService from "../../services/reportService.js";

const getSummary = async({response}) => {    
    const result = await reportService.getApiReports();
    if (result) {
        response.body = { summary: result };
    }
} 

const getSummaryByDate = async({params, response}) => {
    const date = `${params.year}-${params.month}-${params.day}`;
    const result = await reportService.getApiReportsByDate(date);
    response.body = { summaryByDate: result }
}


export { getSummary, getSummaryByDate };

