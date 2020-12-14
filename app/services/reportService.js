import { executeQuery } from "../database/database.js";
import {
  validate,
  required,
  isNumber,
  maxNumber,
  minNumber
} from "../deps.js";

const getApiReports = async() => {
  const result = {};

  result.sleep_duration = (await executeQuery(`SELECT AVG(sleep_duration)::numeric(10,1)FROM reports
                                            WHERE report_date BETWEEN current_date - INTEGER '7' AND current_date;`)).rowsOfObjects()[0];

  result.exercise_time = (await executeQuery(`SELECT AVG(time_spent_on_sports_n_exercise)::numeric(10,1) FROM reports
                                            WHERE report_date BETWEEN current_date - INTEGER '7' AND current_date;`)).rowsOfObjects()[0];

  result.study_time = (await executeQuery(`SELECT AVG(time_spent_studying)::numeric(10,1) FROM reports
                                            WHERE report_date BETWEEN current_date - INTEGER '7' AND current_date;`)).rowsOfObjects()[0];

  result.sleep_quality = (await executeQuery(`SELECT AVG(sleep_quality)::numeric(10,1) FROM reports
                                            WHERE report_date BETWEEN current_date - INTEGER '7' AND current_date;`)).rowsOfObjects()[0];

  result.mood_morning = (await executeQuery(`SELECT AVG(generic_mood_morning)::numeric(10,1) FROM reports
                                            WHERE report_date BETWEEN current_date - INTEGER '7' AND current_date;`)).rowsOfObjects()[0];

  result.mood_evening = (await executeQuery(`SELECT AVG(generic_mood_evening)::numeric(10,1) FROM reports
                                            WHERE report_date BETWEEN current_date - INTEGER '7' AND current_date;`)).rowsOfObjects()[0];

  if (result) {
    return result;
  } else {
    return [];
  }
}

const getApiReportsByDate = async(date) => {
  const result = {};

  result.sleep_duration = (await executeQuery(`SELECT AVG(sleep_duration)::numeric(10,1) FROM reports
                                            WHERE report_date = $1;`, date)).rowsOfObjects()[0];

  result.exercise_time = (await executeQuery(`SELECT AVG(time_spent_on_sports_n_exercise)::numeric(10,1) FROM reports
                                            WHERE report_date = $1;`, date)).rowsOfObjects()[0];

  result.study_time = (await executeQuery(`SELECT AVG(time_spent_studying)::numeric(10,1) FROM reports
                                            WHERE report_date = $1;`, date)).rowsOfObjects()[0];

  result.sleep_quality = (await executeQuery(`SELECT AVG(sleep_quality)::numeric(10,1) FROM reports
                                            WHERE report_date = $1;`, date)).rowsOfObjects()[0];

  result.mood_morning = (await executeQuery(`SELECT AVG(generic_mood_morning)::numeric(10,1) FROM reports
                                            WHERE report_date = $1;`, date)).rowsOfObjects()[0];

  result.mood_evening = (await executeQuery(`SELECT AVG(generic_mood_evening)::numeric(10,1) FROM reports
                                            WHERE report_date = $1;`, date)).rowsOfObjects()[0];

  if (result) {
    return result;
  } else {
    return [];
  }
}


const getSummary = async(user_id) => {
  const result = {};

  result.sleep_duration = (await executeQuery(`SELECT AVG(sleep_duration)::numeric(10,1)FROM reports
                                            WHERE user_id = $1 AND report_date BETWEEN current_date - INTEGER '7' AND current_date;`, user_id)).rowsOfObjects()[0];

  result.exercise_time = (await executeQuery(`SELECT AVG(time_spent_on_sports_n_exercise)::numeric(10,1) FROM reports
                                            WHERE user_id = $1 AND report_date BETWEEN current_date - INTEGER '7' AND current_date;`, user_id)).rowsOfObjects()[0];

  result.study_time = (await executeQuery(`SELECT AVG(time_spent_studying)::numeric(10,1) FROM reports
                                            WHERE user_id = $1 AND report_date BETWEEN current_date - INTEGER '7' AND current_date;`, user_id)).rowsOfObjects()[0];

  result.sleep_quality = (await executeQuery(`SELECT AVG(sleep_quality)::numeric(10,1) FROM reports
                                            WHERE user_id = $1 AND report_date BETWEEN current_date - INTEGER '7' AND current_date;`, user_id)).rowsOfObjects()[0];

  result.mood_morning = (await executeQuery(`SELECT AVG(generic_mood_morning)::numeric(10,1) FROM reports
                                            WHERE user_id = $1 AND report_date BETWEEN current_date - INTEGER '7' AND current_date;`, user_id)).rowsOfObjects()[0];

  result.mood_evening = (await executeQuery(`SELECT AVG(generic_mood_evening)::numeric(10,1) FROM reports
                                            WHERE user_id = $1 AND report_date BETWEEN current_date - INTEGER '7' AND current_date;`, user_id)).rowsOfObjects()[0];

  if (result) {
    return result;
  } else {
    return [];
  }
}


const getReports = async(user_id) => {
  const result = await executeQuery("SELECT * FROM reports WHERE user_id = $1 ORDER BY report_date DESC;", user_id);
  if (result && result.rowCount > 0) {
    return result.rowsOfObjects();
  }
  return [];
}


const getOneReport = async(user_id, report_date) => {
  const result = await executeQuery("SELECT * FROM reports WHERE user_id = $1 AND report_date = $2;", user_id, report_date);
  if (result && result.rowCount > 0) {
    return result.rowsOfObjects()[0];
  }
  return [];
}


const validationRulesMorning = {
  sleep_duration: [required, isNumber, minNumber(0), maxNumber(24)],
  sleep_quality: [required, isNumber, minNumber(1), maxNumber(5)],
  morning_mood: [required, isNumber, minNumber(1), maxNumber(5)]
};


const validationRulesEvening = {
  time: [required, isNumber, minNumber(0), maxNumber(24)],
  duration: [required, isNumber, minNumber(0), maxNumber(24)],
  regularity: [required, isNumber, minNumber(1), maxNumber(5)],
  quality: [required, isNumber, minNumber(1), maxNumber(5)],
  evening_mood: [required, isNumber, minNumber(1), maxNumber(5)]
};


let dataMorning = {
  sleep_duration: '',
  sleep_quality: '',
  morning_mood: '',
  morning_or_evening: '',
  date_morning: '',
  errors: {}
};


let dataEvening = {
  time: '',
  duration: '',
  regularity: '',
  quality: '',
  evening_mood: '',
  morning_or_evening: '',
  date_evening: '',
  errors: {}
};


const getReportDataMorning = async(request) => {
  //tyhjennetään dataMorning.errors objekti aina uuden post kutsun alussa
  dataMorning.errors = {};

  if (request) {
    const body = request.body();
    const params = await body.value;
  
    //adds params to dataMorning object
    dataMorning.sleep_duration = Number(params.get('sleep_duration'));
    dataMorning.sleep_quality = Number(params.get('sleep_quality'));
    dataMorning.morning_mood = Number(params.get('generic_mood_morning'));
    dataMorning.morning_or_evening = params.get('morning_or_evening');
    //dataMorning.date = params.get('date');
    if (params.has('date_morning')) {
      dataMorning.date_morning = new Date(params.get('date_morning'));
    }
  }
  return dataMorning;
}


const getReportDataEvening = async(request) => {
  //tyhjennetään dataEvening.errors objekti aina uuden post kutsun alussa
  dataEvening.errors = {};

  if (request) {
    const body = request.body();
    const params = await body.value;
    
    //adds params to dataEvening object
    dataEvening.time = Number(params.get('time_spent_on_sports_n_exercise'));
    dataEvening.duration = Number(params.get('time_spent_studying'));
    dataEvening.regularity = Number(params.get('regularity_of_eating'));
    dataEvening.quality = Number(params.get('quality_of_eating'));
    dataEvening.evening_mood = Number(params.get('generic_mood_evening'));
    dataEvening.morning_or_evening = params.get('morning_or_evening');
    //dataEvening.date = params.get('date');
    if (params.has('date_evening')) {
      dataEvening.date_evening = new Date(params.get('date_evening'));
    }
  }
  return dataEvening;
}


const setReport = async(request, session) => {

  const dataMorning = await getReportDataMorning(request);
  const [morningPasses, morningErrors] = await validate(dataMorning, validationRulesMorning);
  if (!morningPasses) {
    dataMorning.errors = morningErrors;
  }
  
  const dataEvening =  await getReportDataEvening(request);
  const [eveningPasses, eveningErrors] = await validate(dataEvening, validationRulesEvening);
  if (!eveningPasses) {
    dataEvening.errors = eveningErrors;
  }

  //asettaa oikean päivän ja hakee käyttäjän user_id:n
  let dateNowObj = new Date();
  const report_date = `${dateNowObj.getFullYear()}-${dateNowObj.getMonth() + 1}-${dateNowObj.getDate()}`;
  const user_id = (await session.get('user')).id;

  if (dataMorning.morning_or_evening === 'morning') {
    //PÄIVÄRAPORTTI
    //jos ei ole erroreita niin lähetetään raportti tietokantaan
    if (Object.entries(dataMorning.errors).length === 0) {
      //jos on annettu parametrinä mennyt päivämäärä, merkataan raportti kyseiselle päivämäärälle
      if (dataMorning.date_morning && dataMorning.date_morning < dateNowObj) {
        //tarkistaa mikäli kyseinen päivä on jo kirjattuna tietokantaan
        const result = await executeQuery("SELECT * FROM reports WHERE report_date = $1 AND user_id = $2;", dataMorning.date_morning, user_id);
        if (result && result.rowCount > 0) {
          await executeQuery(`UPDATE reports SET
                              sleep_duration = $1,
                              sleep_quality = $2,
                              generic_mood_morning = $3
                              WHERE report_date = $4 AND user_id = $5;`,
                              dataMorning.sleep_duration,
                              dataMorning.sleep_quality,
                              dataMorning.morning_mood,
                              dataMorning.date_morning,
                              user_id);
        } else {
          await executeQuery(`INSERT INTO reports (
                              report_date,
                              user_id,
                              sleep_duration,
                              sleep_quality,
                              generic_mood_morning)
                              VALUES ($1, $2, $3, $4, $5);`,
                              dataMorning.date_morning,
                              user_id,
                              dataMorning.sleep_duration,
                              dataMorning.sleep_quality,
                              dataMorning.morning_mood);
        }
      } else if (dataMorning.date_morning && dataMorning.date_morning > dateNowObj) {
          dataMorning.errors.date_morning = {'date_morning':'date can not be a future date'};
          return dataMorning;

      } else {
        //jos päivää ei spesifioitu lomakkeessa, käytetään suoraan tätä päivää
        const result = await executeQuery("SELECT * FROM reports WHERE report_date = $1 AND user_id = $2;", report_date, user_id);
        if (result && result.rowCount > 0) {
          await executeQuery(`UPDATE reports SET
                              sleep_duration = $1,
                              sleep_quality = $2,
                              generic_mood_morning = $3
                              WHERE report_date = $4 AND user_id = $5;`,
                              dataMorning.sleep_duration,
                              dataMorning.sleep_quality,
                              dataMorning.morning_mood,
                              report_date,
                              user_id);
        } else {
          await executeQuery(`INSERT INTO reports (
                              user_id,
                              sleep_duration,
                              sleep_quality,
                              generic_mood_morning)
                              VALUES ($1, $2, $3, $4);`,
                              user_id,
                              dataMorning.sleep_duration,
                              dataMorning.sleep_quality,
                              dataMorning.morning_mood);
        }
      }
    } else {
      return dataMorning;
    }

  } else {
    //ILTARAPORTTI
    if (Object.entries(dataEvening.errors).length === 0) {
      //jos on annettu parametrinä mennyt päivämäärä, merkataan raportti kyseiselle päivämäärälle
      if (dataEvening.date_evening && dataEvening.date_evening < dateNowObj) {
        //tarkistaa mikäli kyseiseltä päivältä on merkattuna jo illan raportti tietokantaan
        const result = await executeQuery("SELECT * FROM reports WHERE report_date = $1 AND user_id = $2;", dataEvening.date_evening, user_id);
        if (result && result.rowCount > 0) {
          await executeQuery(`UPDATE reports SET
                              time_spent_on_sports_n_exercise = $1,
                              time_spent_studying = $2,
                              regularity_of_eating = $3,
                              quality_of_eating = $4,
                              generic_mood_evening = $5
                              WHERE report_date = $6 AND user_id = $7;`,
                              dataEvening.time,
                              dataEvening.duration,
                              dataEvening.regularity,
                              dataEvening.quality,
                              dataEvening.evening_mood,
                              dataEvening.date_evening,
                              user_id); 
        } else {
          await executeQuery(`INSERT INTO reports (
                            report_date,
                            user_id,
                            time_spent_on_sports_n_exercise,
                            time_spent_studying,
                            regularity_of_eating,
                            quality_of_eating,
                            generic_mood_evening)
                            VALUES ($1, $2, $3, $4, $5, $6, $7);`,
                            dataEvening.date_evening,
                            user_id,
                            dataEvening.time,
                            dataEvening.duration,
                            dataEvening.regularity,
                            dataEvening.quality,
                            dataEvening.evening_mood);
        }
      } else if (dataEvening.date_evening && dataEvening.date_evening > dateNowObj) {
          dataEvening.errors.date_evening = {"isLarger": "date can not be a future date"};
          return dataEvening;

      } else {
        //tarkistaa mikäli kyseiseltä päivältä on merkattuna jo illan raportti tietokantaan
        //jos päivää ei spesifioitu lomakkeessa, käytetään suoraan tätä päivää
        const result = await executeQuery("SELECT * FROM reports WHERE report_date = $1 AND user_id = $2;", report_date, user_id);
        if (result && result.rowCount > 0) {
          await executeQuery(`UPDATE reports SET
                              time_spent_on_sports_n_exercise = $1,
                              time_spent_studying = $2,
                              regularity_of_eating = $3,
                              quality_of_eating = $4,
                              generic_mood_evening = $5
                              WHERE report_date = $6 AND user_id = $7;`,
                              dataEvening.time,
                              dataEvening.duration,
                              dataEvening.regularity,
                              dataEvening.quality,
                              dataEvening.evening_mood,
                              report_date,
                              user_id); 
        } else {
          await executeQuery(`INSERT INTO reports (
                            user_id,
                            time_spent_on_sports_n_exercise,
                            time_spent_studying,
                            regularity_of_eating,
                            quality_of_eating,
                            generic_mood_evening)
                            VALUES ($1, $2, $3, $4, $5, $6);`,
                            user_id,
                            dataEvening.time,
                            dataEvening.duration,
                            dataEvening.regularity,
                            dataEvening.quality,
                            dataEvening.evening_mood);
        }
      }
    } else {
      return dataEvening;
    }
  }
}


export { getReports, getOneReport, setReport, getSummary, getApiReports, getApiReportsByDate };