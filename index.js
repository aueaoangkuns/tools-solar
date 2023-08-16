// Connect Database
let knex = require('knex')({
    client: 'mssql',
    connection: {
        server : 'DESKTOP-9PESU7N',
        user : 'sroiaudom',
        password : '0822914530aA',
        database : 'Test'
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
async function getDeviceData(DeviceCode,DevIdType){
    try {
        const token = await hwLogin();
        const config = {
            headers: {
                'xsrf-token': token
            }
        };
        const data = {
            devIds : DeviceCode , devTypeId : DevIdType
        }
        const response = await axios.post(baseUrl + 'getDevRealKpi', data, config)
        return response.data

    }
    catch (e) {
        throw e
    }
}
// การแสดงผลข้อมูล
async function writeDB() {
    const response = await getDeviceData('1000000033980716,1000000033980715,1000000033980714,1000000033980713,1000000033980712,1000000033980711,1000000033980710,1000000033980709,1000000033980724,1000000033980723,1000000033980722','1')
    const obj = response

    for (i = 0 ; i <= 10 ; i++ )
    {
        const obj2 = response.data[i]
        const time = obj.params['currentTime']

        const dataItemMap = obj2.dataItemMap
        const devID = obj2.devId
        const ActivePower = dataItemMap['active_power']

        const sql = `PH3 (${devID},${ActivePower},${time})`
        console.log(sql)

        const insertDemo = (DEVID, ACTPOWER, TIME ) => {
            knex('Test_API').insert({
                 devId: DEVID,
                 active_power: ACTPOWER,
                 currentTime: TIME
            }).then((countRows)=>{
                console.log(`${countRows} number of records have been insert`)
            }).finally(function(){
                knex.destroy();
            });
        };
        insertDemo(devID,ActivePower,time)
        
    }
    
}
writeDB();