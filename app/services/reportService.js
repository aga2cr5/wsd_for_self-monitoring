import { executeQuery } from "../database/database.js";
import {
  validate,
  required,
  isNumber,
  maxNumber,
  minNumber
} from "../deps.js";


const getReports = async(user_id) => {
  const result = await executeQuery("SELECT * FROM reports WHERE user_id = $1;", user_id);
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
  duration: [required, isNumber, minNumber(0), maxNumber(24)],
  quality: [required, isNumber, minNumber(1), maxNumber(5)],
  mood: [required, isNumber, minNumber(1), maxNumber(5)]
};


const validationRulesEvening = {
  time: [required, isNumber, minNumber(0), maxNumber(24)],
  duration: [required, isNumber, minNumber(0), maxNumber(24)],
  regularity: [required, isNumber, minNumber(1), maxNumber(5)],
  quality: [required, isNumber, minNumber(1), maxNumber(5)],
  mood: [required, isNumber, minNumber(1), maxNumber(5)]
};


let dataMorning = {
  duration: '',
  quality: '',
  mood: '',
  morning_or_evening: '',
  date: '',
  errors: null
};


let dataEvening = {
  time: '',
  duration: '',
  regularity: '',
  quality: '',
  mood: '',
  morning_or_evening: '',
  date: '',
  errors: null
};


const getReportDataMorning = async(request) => {
  //tyhjennetään dataMorning objekti aina uuden post kutsun alussa
  dataMorning = {
    duration: '',
    quality: '',
    mood: '',
    morning_or_evening: '',
    date: '',
    errors: null
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
  
    //adds params to dataMorning object
    dataMorning.duration = Number(params.get('sleep_duration'));
    dataMorning.quality = Number(params.get('sleep_quality'));
    dataMorning.mood = Number(params.get('generic_mood_morning'));
    dataMorning.morning_or_evening = params.get('morning_or_evening');
    //dataMorning.date = params.get('date');
    if (params.has('date')) {
      console.log(params.get('date'));
      dataMorning.date = new Date(params.get('date'));
    }
  }
  return dataMorning;
}


const getReportDataEvening = async(request) => {
  //tyhjennetään dataEvening objekti aina uuden post kutsun alussa
  dataEvening = {
    time: '',
    duration: '',
    regularity: '',
    quality: '',
    mood: '',
    morning_or_evening: '',
    date: '',
    errors: null
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    
    //adds params to dataEvening object
    dataEvening.time = Number(params.get('time_spent_on_sports_n_exercise'));
    dataEvening.duration = Number(params.get('time_spent_studying'));
    dataEvening.regularity = Number(params.get('regularity_of_eating'));
    dataEvening.quality = Number(params.get('quality_of_eating'));
    dataEvening.mood = Number(params.get('generic_mood_evening'));
    dataEvening.morning_or_evening = params.get('morning_or_evening');
    //dataEvening.date = params.get('date');
    if (params.has('date')) {
      console.log(params.get('date'));
      dataEvening.date = new Date(params.get('date'));
    }
  }
  return dataEvening;
}


const setReport = async(request, session) => {

  //FUNKTIO ANTAA ERRORIN JOS YRITTÄä MERKITÄ TULEVALLE PÄIVÄMÄÄRÄLLE RAPORTTIA
  //SAATTAA JOHTUA SIITÄ, ETTÄ DATA OBJEKTI ALUSTETAAN AINA GETREPORTDATA FUNKTIOSSA.
  //VOISIKO SIIS OLLA, ETTÄ ALEMPANA DATAMORNING.ERRORS.DATE = {"JOTAIN": "JOTAINM_MUUTA"};
  //EI SAISI "YHTEYTTÄ" DATAOBJEKTIIN



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
  
  console.log(dataMorning);

  if (dataMorning.morning_or_evening === 'morning') {
    //PÄIVÄRAPORTTI
    //jos ei ole erroreita niin lähetetään raportti tietokantaan
    if (!dataMorning.errors) {


      //MOLEMPIEN TÄYTYY OLLA DATE OBJECTEJA, JOTTA NIITÄ VOIDAAN VERTAILLA
      console.log('dataMorning date:');
      console.log(dataMorning.date);
      console.log(typeof dataMorning.date);

      console.log('report date:');
      console.log(report_date);
      console.log(typeof dateNowObj);
      //jos on annettu parametrinä mennyt päivämäärä, merkataan raportti kyseiselle päivämäärälle
      if (dataMorning.date && dataMorning.date < dateNowObj) {
        console.log('date on the past');
        //tarkistaa mikäli kyseinen päivä on jo kirjattuna tietokantaan
        const result = await executeQuery("SELECT * FROM reports WHERE report_date = $1 AND user_id = $2;", dataMorning.date, user_id);
        if (result && result.rowCount > 0) {
          await executeQuery(`UPDATE reports SET
                              sleep_duration = $1,
                              sleep_quality = $2,
                              generic_mood_morning = $3
                              WHERE report_date = $4 AND user_id = $5;`,
                              dataMorning.duration,
                              dataMorning.quality,
                              dataMorning.mood,
                              dataMorning.date,
                              user_id);
        } else {
          await executeQuery(`INSERT INTO reports (
                              report_date,
                              user_id,
                              sleep_duration,
                              sleep_quality,
                              generic_mood_morning)
                              VALUES ($1, $2, $3, $4, $5);`,
                              dataMorning.date,
                              user_id,
                              dataMorning.duration,
                              dataMorning.quality,
                              dataMorning.mood);
        }
      } else if (dataMorning.date && dataMorning.date > dateNowObj) {
          console.log('date in the future');
          dataMorning.errors.date = {"isLarger": "date can not be a future date"};
          return dataMorning;

      } else {
        //jos päivää ei spesifioitu lomakkeessa, käytetään suoraan tätä päivää
        console.log('day not specified. checks if entry found from database form current date');
        const result = await executeQuery("SELECT * FROM reports WHERE report_date = $1 AND user_id = $2;", report_date, user_id);
        if (result && result.rowCount > 0) {
          await executeQuery(`UPDATE reports SET
                              sleep_duration = $1,
                              sleep_quality = $2,
                              generic_mood_morning = $3
                              WHERE report_date = $4 AND user_id = $5;`,
                              dataMorning.duration,
                              dataMorning.quality,
                              dataMorning.mood,
                              report_date,
                              user_id);
        } else {
          console.log('if not then we set new report');
          await executeQuery(`INSERT INTO reports (
                              user_id,
                              sleep_duration,
                              sleep_quality,
                              generic_mood_morning)
                              VALUES ($1, $2, $3, $4);`,
                              user_id,
                              dataMorning.duration,
                              dataMorning.quality,
                              dataMorning.mood);
        }
      }
    } else {
      return dataMorning;
    }

  } else {
    //ILTARAPORTTI
    console.log('iltaraportti');
    if (!dataEvening.errors) {

      //jos on annettu parametrinä mennyt päivämäärä, merkataan raportti kyseiselle päivämäärälle
      if (dataEvening.date && dataEvening.date < dateNowObj) {
        console.log('iltaraportti; given date is past');
        //tarkistaa mikäli kyseiseltä päivältä on merkattuna jo illan raportti tietokantaan
        const result = await executeQuery("SELECT * FROM reports WHERE report_date = $1 AND user_id = $2;", dataEvening.date, user_id);
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
                              dataEvening.mood,
                              dataEvening.date,
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
                            VALUES ($1, $2, $3, $4, $5);`,
                            dataEvening.date,
                            user_id,
                            dataEvening.time,
                            dataEvening.duration,
                            dataEvening.regularity,
                            dataEvening.quality,
                            dataEvening.mood);
        }
      } else if (dataEvening.date && dataEvening.date > report_date) {
          dataEvening.errors.date = {"isLarger": "date can not be a future date"};
          return dataEvening;

      } else {
        console.log('iltaraportti; no given date');
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
                              dataEvening.mood,
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
                            VALUES ($1, $2, $3, $4);`,
                            user_id,
                            dataEvening.time,
                            dataEvening.duration,
                            dataEvening.regularity,
                            dataEvening.quality,
                            dataEvening.mood);
        }
      }
    } else {
      return dataEvening;
    }

  }
}


export { getReports, getOneReport, setReport };