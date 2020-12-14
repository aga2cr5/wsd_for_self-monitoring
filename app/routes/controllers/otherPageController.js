import { getGlimpseOfData } from "../../services/otherPageServices.js";

const data = {
    avg: "no moods reported during today and yesterday",
    thingsLooking: "no data on this regard"
};

const showFrontPage = async({render}) => {
    const result = await getGlimpseOfData();
    if (result) {
        render('index.ejs', {data: result});
    } else {
        render('index.ejs', { data: data });
    }
}


export { showFrontPage };