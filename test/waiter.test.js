const assert = require('assert');
const waiterApp = require('../week_days');
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgres://busisile:pg123@localhost/waiter_database';

const pool = new Pool({
    connectionString
});


describe('The Waiter database webApp', function () {
    beforeEach(async function(){
        await pool.query('delete from days_booked');
        await pool.query('delete from waiter_names');
    });
    it('It should return all on days of week', async function(){
        let waiter = waiterApp(pool);
        let days = await waiter.allWeekDays();
        assert.deepEqual(days, [{"id":1,"day":"Sunday"},{"id":2,"day":"Monday"},{"id":3,"day":"Tuesday"},{"id":4,"day":"Wednesday"},{"id":5,"day":"Thursday"},{"id":6,"day":"Friday"},{"id":7,"day":"Saturday"}]);
    });
    it('It should return TRUE when name is on the database', async function(){
        let waiter = waiterApp(pool);
        await waiter.add('Busisile');
        let nameCheck = await waiter.checkNames('busisile');
        assert.equal(nameCheck, true);
    });
    it('It should return FALSE when name is not the database', async function(){
        let waiter = waiterApp(pool);
        await waiter.add('Busisile');
        let nameCheck = await waiter.checkNames('anele');
        assert.equal(nameCheck, false);
    });
    it('It should return a name from the database', async function(){
        let waiter = waiterApp(pool);
        await waiter.add('Busisile');
        await waiter.add('anele');
        let nameFetch = await waiter.getName('anele');
        assert.equal(nameFetch.names, 'anele');
    });
    it('It should return all days with days booked by waiter checked', async function(){
        let waiter = waiterApp(pool);
        await waiter.addData('Busisile', ['2', '3', '4']);
        await waiter.addData('anele', ['2','4']);
        let daysFetchAnele = await waiter.getDays('anele');
        let daysFetchBusisile = await waiter.getDays('busisile');
        assert.deepEqual(daysFetchAnele, [
                                        {"id":1,"day":"Sunday"},
                                        {"id":2,"day":"Monday","checked":"checked"},
                                        {"id":3,"day":"Tuesday"},
                                        {"id":4,"day":"Wednesday","checked":"checked"},
                                        {"id":5,"day":"Thursday"},
                                        {"id":6,"day":"Friday"},
                                        {"id":7,"day":"Saturday"}]
                                        );
        assert.deepEqual(daysFetchBusisile,[
                                            {"id":1,"day":"Sunday"},
                                            {"id":2,"day":"Monday","checked":"checked"},
                                            {"id":3,"day":"Tuesday","checked":"checked"},
                                            {"id":4,"day":"Wednesday","checked":"checked"},
                                            {"id":5,"day":"Thursday"},
                                            {"id":6,"day":"Friday"},
                                            {"id":7,"day":"Saturday"}
                                        ] );    
    });
    it('It should return all days with colors: Green, Yellow, Red  ', async function(){
        let waiter = waiterApp(pool);
        await waiter.addData('Busisile', ['2', '3', '4']);
        await waiter.addData('anele', ['2','4']);
        await waiter.addData('yegan', ['2','4', '7']);
        await waiter.addData('grag', ['4']);
        let colorDays = await waiter.namesEachDays();
        assert.deepEqual(colorDays, [
                                        {"id":1,"day":"Sunday","waiters":[],"color":"yellow"},
                                        {"id":2,"day":"Monday","waiters":[{"names":"busisile"},{"names":"anele"},{"names":"yegan"}],"color":"green"},
                                        {"id":3,"day":"Tuesday","waiters":[{"names":"busisile"}],"color":"yellow"},
                                        {"id":4,"day":"Wednesday","waiters":[{"names":"busisile"},{"names":"anele"},{"names":"yegan"},{"names":"grag"}],"color":"red"},
                                        {"id":5,"day":"Thursday","waiters":[],"color":"yellow"},
                                        {"id":6,"day":"Friday","waiters":[],"color":"yellow"},
                                        {"id":7,"day":"Saturday","waiters":[{"names":"yegan"}],"color":"yellow"}
                                    ]);
    });
    it('It should clear the waiter names and their booked days', async function(){
        let waiter = waiterApp(pool);
        await waiter.addData('Busisile', ['2', '3', '4']);
        await waiter.addData('anele', ['2','4']);
        await waiter.addData('yegan', ['2','4', '7']);
        await waiter.addData('grag', ['4']);
        let getEmpty = await waiter.clearNames();
        assert.deepEqual(getEmpty, [
                                        {"id":1,"day":"Sunday","waiters":[],"color":"yellow"},
                                        {"id":2,"day":"Monday","waiters":[],"color":"yellow"},
                                        {"id":3,"day":"Tuesday","waiters":[],"color":"yellow"},
                                        {"id":4,"day":"Wednesday","waiters":[],"color":"yellow"},
                                        {"id":5,"day":"Thursday","waiters":[],"color":"yellow"},
                                        {"id":6,"day":"Friday","waiters":[],"color":"yellow"},
                                        {"id":7,"day":"Saturday","waiters":[],"color":"yellow"}
                                    ]);
    });    
    after(function(){
        pool.end();
    });
});