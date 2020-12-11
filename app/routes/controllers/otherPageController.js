const showFrontPage = ({render}) => {
    render('index.ejs');
}


const showLandingPage = async({render, session}) => {
    const userObj = (await session.get('user'));
    render('landing.ejs', { email: userObj.email, user_id: userObj.id });
}



//tänne ilmeisesti vielä jotain summaryä


export { showFrontPage, showLandingPage };