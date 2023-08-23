
let knex = require('knex')({
    client: 'mssql',
    connection: {
        server : '10.28.99.42',
        user : 'aueaoangkun_s',
        password : '0822914530aA',
        database : 'NPS_SOLAR',
        options: {
            trustedConnection: true
        }
    }
});


const axios = require('axios');
require('dotenv').config()
const baseUrl = 'https://intl.fusionsolar.huawei.com/thirdData/'


async function hwLogin() {
    const data = {
        userName: process.env.USER_NAME,
        systemCode: process.env.SYSTEM_CODE
    }
    try {
        const response = await axios.post(baseUrl + 'login', data)
        const xsrf = response.headers['xsrf-token']
        if (xsrf) return xsrf
        else throw ({ message: 'Log In Failed' })
    }
    catch (e) {
        throw (e.message)
    }
}

async function getDeviceData(DeviceCode,DevIdType,StartTime,EndTime){
    try {
        const token = await hwLogin();
        const config = {
            headers: {
                'xsrf-token': token
            }
        };
        const data = {
            devIds : DeviceCode , devTypeId : DevIdType , startTime : StartTime , endTime : EndTime
        }
        const response = await axios.post(baseUrl + 'getDevHistoryKpi', data, config)
        return response.data

    }
    catch (e) {
        throw e
    }
}

// const cron = require("node-cron")
// function create_datetime(seconds, minute, hour, day, month, day_of_week){
//     return seconds + " " + minute + " " + hour + " " + day + " " + month + " " + day_of_week
// }console.log("Start!!")

// cron.schedule(' * * * * *', () => {
//     writeDB();
// })

async function writeDB() {
    try {
        const response = await getDeviceData('1000000033980722,1000000033980721,1000000033980720,1000000033980719,1000000033980718,1000000033980717,1000000033980728,1000000033980727,1000000033980726,1000000033980725',1,1690844400000,1691064000000)
        const obj = response

        for (i = 0; i < response.data.length ; i++ ) {
            const obj2 = response.data[i]
            const devID = obj2.devId
            const time = obj2.collectTime

            const dataItemMap = obj2.dataItemMap
            const ActivePower = dataItemMap['active_power']

            const milliseconds = parseInt(time, 10)
            const dateTime = new Date(milliseconds)
            const minute = dateTime.getMinutes()
            const minuteStr = minute.toString()
            const sql = `PH4 No.${i+ 1}\t${dateTime.toLocaleString()}\t${devID}\t${ActivePower}\t${time}`
            
            console.log(sql)
            await knex('Ph_Dv').insert({
                PowerHouse : 'PowerHouse4',
                DateTime : dateTime,
                CodeTime : minuteStr,
                DeviceId: devID,
                ActivePower: ActivePower,
                CodeCurrentTime: time
            })
        }
        let date = new Date();
        console.log("------------ "+date.toLocaleString()+" -----------------");
        console.log(`---------------   Wait 30 min     ------------------`)

    }
    catch (e) {
        console.log('Error', e.message)
    }
}writeDB()