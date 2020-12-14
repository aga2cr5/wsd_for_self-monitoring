import * as reportService from "../../services/reportService.js";

//tänne mahdollisesti tarvitsee vielä lisää funktioita hyödyntämään reportServicen kaikkia funktioita..
//tai sitten ne tulevat api kansioon....

const data = {
  sleep_duration: '',
  sleep_quality: '',
  morning_mood: '',
  time: '',
  duration: '',
  regularity: '',
  quality: '',
  evening_mood: '',
  date: '',
  errors: null
};


const showReports = async({render, session}) => {
  const user_id = (await session.get('user')).id;
  const email = (await session.get('user')).email;

  render('reports.ejs', {
          reports: await reportService.getReports(user_id),
          email: email,
          data: data,
          user_id: user_id
        });
}



const getSummary = async({render, session}) => {
  const user_id = (await session.get('user')).id;
  const email = (await session.get('user')).email;

  render('summary.ejs', {
          summary: await reportService.getSummary(user_id),
          email: email,
          user_id: user_id
       });
  
}


const addReport = async({response, request, render, session}) => {
  //hakee user_id:n ja emailin
  const user_id = (await session.get('user')).id;
  const email = (await session.get('user')).email;

  const result = await reportService.setReport(request, session);
  if (result) {
    render('reports.ejs', {
          reports: await reportService.getReports(user_id),
          email: email,
          data: result,
          user_id: user_id
        });

  } else {
    response.status = 200;
    response.redirect('/behavior/reporting');
  }
}


export { showReports, addReport, getSummary }
