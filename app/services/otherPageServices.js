import { executeQuery } from "../database/database.js";

let avgMood = {avg: "no moods reported during today and yesterday",
    thingsLooking: "no data on this regard"
};

const getGlimpseOfData = async() => {
    const avg_morning_today = await executeQuery("SELECT AVG(generic_mood_morning)::numeric(10,0) FROM reports WHERE report_date = current_date;");
    const avg_evening_today = await executeQuery("SELECT AVG(generic_mood_evening)::numeric(10,0) FROM reports WHERE report_date = current_date;");
    
    const avg_morning_yesterday = await executeQuery("SELECT AVG(generic_mood_morning)::numeric(10,0) FROM reports WHERE report_date = current_date - INTEGER '1';");
    const avg_evening_yesterday = await executeQuery("SELECT AVG(generic_mood_evening)::numeric(10,0) FROM reports WHERE report_date = current_date - INTEGER '1';");

    const avg_mood_today = Number((avg_morning_today.rowsOfObjects()[0]).avg) + Number((avg_evening_today.rowsOfObjects()[0]).avg);
    const avg_mood_yesterday = Number((avg_morning_yesterday.rowsOfObjects()[0]).avg) + Number((avg_evening_yesterday.rowsOfObjects()[0]).avg);

    if (avg_mood_today || avg_mood_yesterday) {
        const averageMood = (avg_mood_today + avg_mood_yesterday) / 2;
        avgMood.avg = averageMood;

        if (avg_mood_today > avg_mood_yesterday) {
            avgMood.thingsLooking = "things are looking bright today";
        } else {
            avgMood.thingsLooking = "things are looking gloomy today";
        }
        return avgMood;
    } else {
        return avgMood;
    }
}

export { getGlimpseOfData };