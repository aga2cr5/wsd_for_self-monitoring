import { executeQuery } from "../database/database.js";


const getReports = async(user_id) => {
  const result = await executeQuery("SELECT * FROM reports WHERE user_id = $1;", user_id);
  if (result && result.rowCount > 0) {
    return result.rowsOfObjects()
  }
  return 'No reports available'
}

const getOneReport = async(user_id, report_date) => {
  const result = await executeQuery("SELECT * FROM reports WHERE user_id = $1 AND report_date = $2;", user_id, report_date);
  if (result && result.rowCount > 0) {
    return result.rowsOfObjects()[0]
  }
  return 'No report available for specific date'
}



const setMorningReport = async(
                        report_date,
                        user_id,
                        sleep_duration,
                        sleep_quality,
                        generic_mood_morning) => {

  //tarkistaa ensin jos kyseinen päivä on jo kirjattuna tietokantaan
  const result = await executeQuery("SELECT * FROM reports WHERE report_date = $1 AND user_id = $2;", report_date, user_id);

  if (result && result.rowCount > 0) {
    await executeQuery(`UPDATE reports SET
                        sleep_duration = $1,
                        sleep_quality = $2,
                        generic_mood_morning = $3
                        WHERE report_date = $4 AND user_id = $5;`,
                        sleep_duration,
                        sleep_quality,
                        generic_mood_morning,
                        report_date,
                        user_id);
  } else {
  //mikäli ei, kirjataan aamun rutiinit ja samalla luodaan uusi report rivi tietokantaan
    await executeQuery(`INSERT INTO reports (
                        user_id,
                        sleep_duration,
                        sleep_quality,
                        generic_mood_morning)
                        VALUES ($1, $2, $3, $4);`,
                        user_id,
                        sleep_duration,
                        sleep_quality,
                        generic_mood_morning);
  }
}

const setEveningReport = async(
                        report_date,
                        user_id,
                        time_spent_on_sports_n_exercise,
                        time_spent_studying,
                        regularity_of_eating,
                        quality_of_eating,
                        generic_mood_evening) => {
  //tarkistaa ensin jos kyseiseltä päivältä on merkattuna jo aamun raportti tietokantaan
  const result = await executeQuery("SELECT * FROM reports WHERE report_date = $1 AND user_id = $2;", report_date, user_id);

  if (result && result.rowCount > 0) {
    await executeQuery(`UPDATE reports SET
                        time_spent_on_sports_n_exercise = $1,
                        time_spent_studying = $2,
                        regularity_of_eating = $3,
                        quality_of_eating = $4,
                        generic_mood_evening = $5
                        WHERE report_date = $6 AND user_id = $7;`,
                        time_spent_on_sports_n_exercise,
                        time_spent_studying,
                        regularity_of_eating,
                        quality_of_eating,
                        generic_mood_evening,
                        report_date,
                        user_id); 
  } else {
    //mikäli ei, luodaan uusi rivi tietokannan pöytään reports ja lisätään sinne illan tiedot
    await executeQuery(`INSERT INTO reports (
                      user_id,
                      time_spent_on_sports_n_exercise,
                      time_spent_studying,
                      regularity_of_eating,
                      quality_of_eating,
                      generic_mood_evening)
                      VALUES ($1, $2, $3, $4, $5);`,
                      user_id,
                      time_spent_on_sports_n_exercise,
                      time_spent_studying,
                      regularity_of_eating,
                      quality_of_eating,
                      generic_mood_evening
                      )
  }
  
}


export { getReports, getOneReport, setMorningReport, setEveningReport };