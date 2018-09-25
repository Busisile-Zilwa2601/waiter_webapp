module.exports = function weekDays(pool) {
    //return all days on the week_days table
    async function allWeekDays() {
        let results = await pool.query('select * from week_days ORDER BY id');
        return results.rows;
    }
    //add to the names database
    async function add(name) {
        let results = await pool.query('select * from waiter_names where names=$1', [name.toLowerCase()]);
        if (results.rows.length > 0) {

        }else {
            await pool.query('insert into waiter_names(names) values($1)', [name.toLowerCase()]);
        }
    }
    //add to the days_booked database
    async function addData(name, days) {
        if (await checkNames(name)) {
            let nameData = await getName(name);
            let nameID = nameData.id;
            await pool.query('delete from days_booked where names_id = $1', [nameID]);
            await insertDays(nameID, days);
        } else {
            await add(name);
            let nameData = await getName(name.toLowerCase());
            let nameID = nameData.id;
            await insertDays(nameID, days);
        }
    }
    //insert name id and week day in into days_booked table
    async function insertDays(nameId, daysID) {
        for (let i = 0; i < daysID.length; i++) {
            await pool.query('insert into days_booked(names_id, week_days_id) values($1, $2)', [nameId, daysID[i]]);
        }
    }
    //check name existance on names table
    async function checkNames(name) {
        let results = await pool.query('select * from waiter_names where names=$1', [name.toLowerCase()]);
        if (results.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    //retun the row of the name on the names table
    async function getName(name) {
        let results;
        if (await checkNames(name)) {
            results = await pool.query('select * from waiter_names where names=$1', [name.toLowerCase()]);
        } else {
            results = null;
        }
        return results.rows[0];
    }
    //Get the days checked
    async function getDays(name) {
        if (await checkNames(name)) {
            let nameData = await getName(name);
            let nameId = nameData.id;
            let results = await pool.query('select week_days_id from days_booked where names_id = $1', [nameId]);
            let weekDays = await allWeekDays();
            for (let i = 0; i < results.rows.length; i++) {
                for (let j = 0; j < weekDays.length; j++) {
                    if (results.rows[i].week_days_id == weekDays[j].id) {
                       weekDays[j].checked = 'checked';
                       break;
                    }
                }
            }
            return weekDays;
        }
    }
    //days query function
    async function namesEachDays(){
        let weekDays = await allWeekDays();
        for (let i = 0; i < weekDays.length; i++){
            let results = await pool.query('select waiter_names.names as names from days_booked join waiter_names on waiter_names.id = days_booked.names_id where days_booked.week_days_id = $1',[weekDays[i].id]);
            weekDays[i].waiters = results.rows;
            //add colors
            if(weekDays[i].waiters.length === 3){
                weekDays[i].color = 'green';
            }
            if(weekDays[i].waiters.length<3){
                weekDays[i].color = 'yellow';
            }
            
            if(weekDays[i].waiters.length>3){
                weekDays[i].color = 'red';
            }       
        }
        return weekDays;
    }
    async function clearNames(){
        await pool.query('delete from days_booked');
        await pool.query('delete from waiter_names');
        return await namesEachDays();
    }
    return {
        allWeekDays,//called on the route module
        add,//used only on this module module
        addData,//called on the route module
        checkNames,//called on the route module
        getName,//called on the route module
        getDays,//called on the route module
        namesEachDays,//called on the route module
        clearNames//called on the route module
    }
}