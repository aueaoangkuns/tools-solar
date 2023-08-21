// Connect Database
let knex = require('knex')({
    client: 'mssql',
    connection: {
        server : '10.28.99.42',
        user : 'aueaoangkun_s',
        password : '0822914530aA',
        database : 'NPS_SOLAR'
    }
});

// config ค่าเพื่อเข้า HTTP API Huawei
const axios = require('axios');
require('dotenv').config()
const baseUrl = 'https://intl.fusionsolar.huawei.com/thirdData/'

// ส่วนของ Login
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
// ส่วนของการใช้งาน get function
async function getDeviceData(DeviceCode,DevIdType,Starttime,Endtime){
    try {
        const token = await hwLogin();
        const config = {
            headers: {
                'xsrf-token': token
            }
        };
        const data = {
            devIds : DeviceCode , devTypeId : DevIdType , startTime : Starttime , endTime : Endtime
        }
        const response = await axios.post(baseUrl + 'getDevHistoryKpi', data, config)
        return response.data

    }
    catch (e) {
        throw e
    }
}

const cron = require("node-cron")
function create_datetime(seconds, minute, hour, day, month, day_of_week){
    return seconds + " " + minute + " " + hour + " " + day + " " + month + " " + day_of_week
}console.log("Start!!")

cron.schedule('50 * * * * *', () => {
    writeDB();
})

async function writeDB() {
    try {
        const response = await getDeviceData('1000000033980923',1 ,1690844400000 ,1690891200000)
        const obj = response

        for (i = 0; i <= 156 ; i++) {
            const obj2 = response.data[i]
            const time = obj2.collectTime
            const dataItemMap = obj2.dataItemMap
            const devID = obj2.devId
            const ActivePower = dataItemMap['active_power']


            const sql = `PH3 No.${i+1} (${devID},${ActivePower},${time})`
            console.log(sql)
            await knex('RT_Dv').insert({
                PowerHouse : 'PowerHouse3',
                DevID: devID,
                ActivePower: ActivePower,
                CurrentTime: time
            })
            
        }
        let date = new Date();
        console.log("------------ "+date.toLocaleString()+" -----------------");
        console.log(`---------------   Wait 30 min     ------------------`)

    }
    catch (e) {
        console.log('Error', e.message)
    }
}