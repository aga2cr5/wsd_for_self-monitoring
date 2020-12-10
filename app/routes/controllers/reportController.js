import * as reportService from "../../services/reportService.js";

//tänne mahdollisesti tarvitsee vielä lisää funktioita hyödyntämään reportServicen kaikkia funktioita..
//tai sitten ne tulevat api kansioon....

const showReports = async({render, session}) => {
  const user_id = (await session.get('user')).id;
  const email = (await session.get('user')).email;
  render('reports.ejs', { reports: await reportService.getReports(user_id), email: email });
}

const addReport = async({response, request, session}) => {
  const user_id = (await session.get('user')).id;


  //date ei taida toimia. tähän jäit eilen yöllä
  let dateObj = new Date();
  const date = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDay()}`;

  const body = request.body();
  const params = await body.value;
  //muista, että params.get() arvot ovat string typejä eli numerot täytyy
  //muuttaa numeroiksi ennen tietokanta queryä.

  //ongelmana decimal number html formin inputista (sleep duration) selvittele miten saadaan muutettua oikeaan muotoon

  //tarkista onko aamu vai ilta ja sen mukaan listää tietoja tietokantaan
  //tämä taitaa nyt toimia... aamun ja illan tarkistus siis
  const morning_or_evening = params.get('morning_or_evening');
  //jos aamu

  //täältä poistettu if lausekkeesta morning
  if (morning_or_evening === '') {
    const sleep_duration = Number(params.get('sleep_duration'));
    const sleep_quality = Number(params.get('sleep_quality'));
    const generic_mood_morning = Number(params.get('generic_mood_morning'));
    console.log(generic_mood_morning);
    await reportService.setMorningReport(
                        date,
                        user_id,
                        sleep_duration,
                        sleep_quality,
                        generic_mood_morning);

    response.status = 200;
    response.redirect('/behavior/reporting');
  //jos on ilta
  } else {
    const time_spent_on_sports_n_exercise = params.get('time_spent_on_sports_n_exercise');
    const time_spent_studying = params.get('time_spent_on_sports_n_exercise');
    const regularity_of_eating = params.get('regularity_of_eating');
    const quality_of_eating = params.get('quality_of_eating');
    const generic_mood_evening = params.get('generic_mood_evening');
    
    await reportService.setEveningReport(
                        date,
                        user_id,
                        time_spent_on_sports_n_exercise,
                        time_spent_studying,
                        regularity_of_eating,
                        quality_of_eating,
                        generic_mood_evening);

    response.status = 200;
    response.redirect('/behavior/reporting');
    }
}


//lisää getSummary funktio

export { showReports, addReport }















//import { getHello } from "../../services/reportService.js";

/*
const hello = async({render}) => {
  render('index.ejs', { hello: await getHello() });
};

export { hello };
*/