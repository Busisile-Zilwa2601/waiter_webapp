module.exports = function routes(weeks){
    async function index(req, res){
        let waiterName = req.params.name;
        try{
            if(await weeks.checkNames(waiterName)){
                let week_days = await weeks.getDays(waiterName);
                let myName = await weeks.getName(waiterName);
                req.flash('info','  You will be working on the days selected below');
                res.render('home', {waiter_name: myName.names,week_days});
            }else{
                //await weeks.add(waiterName);
                let week_days = await weeks.allWeekDays();
                req.flash('info', '  Please select days to work on');
                res.render('home', {waiter_name: waiterName,week_days});
            }
        }catch(err){
            console.error('Could not read data from database', err);
        }
    }
    async function postData(req, res){
        try{
            let waiterName = req.params.name;
            let {day} = req.body;
            if(day == undefined){
                day = [];
            }
            if(await weeks.checkNames(waiterName)){
                await weeks.addData(waiterName, day);
                let myName = await weeks.getName(waiterName);
                res.redirect('/waiter/'+myName.names);
            }else{
                await weeks.addData(waiterName, day);
                let week_days = await weeks.getDays(waiterName);
                req.flash('info',' You have selected the following days');
                res.render('home',{waiter_name: waiterName, week_days});
            }
        }catch(err){
            console.error('Could not post on data base', err);
        }
    }
    //booked days with waiters
    async function getBookings(req, res){
        try{
            let week_days = await weeks.namesEachDays();
            res.render('days', {week_days});
        }catch(err){
            console.error('Database query unrecorgnized ', err);
        }
    }
    //delete the names
    async function clearDays(req, res){
        try{
            await weeks.clearNames();
            res.redirect('/days');
        }catch(err){
            console.error('Could not delete names from the database', err);
        }
    }
    return{
        index,
        postData,
        getBookings,
        clearDays
    }
}