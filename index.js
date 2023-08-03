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

async function getStationList() {
    try {
        const token = await hwLogin();
        const config = {
            headers: {
                'xsrf-token': token
            }
        };
        const data = {
            pageNo: 1
        }
        const response = await axios.post(baseUrl + 'stations', data, config)
        console.log(response.data.data)

    }
    catch (e) {
        console.log(e)
    }
}

async function getStationData(plantCode) {
    try {
        const token = await hwLogin();
        const config = {
            headers: {
                'xsrf-token': token
            }
        };
        const data = {
            stationCodes: plantCode
        }
        const response = await axios.post(baseUrl + 'getStationRealKpi', data, config)
        return response.data.data

    }
    catch (e) {
        throw e
    }
}

async function writeDB() {
    const response = await getStationData('NE=33987445')
    const obj = response[0]
    const dataItemMap = obj.dataItemMap
    const totalPower = dataItemMap['total_power'];
    const dayPower = dataItemMap['day_power']
    const sql = 'INSERT INTO TABLE (total-power, day-power) VALUES (' + totalPower + ',' + dayPower + ')'
    const sql2 = `INSERT INTO TABLE (total-power, day-power) VALUES (${totalPower},${dayPower})`

    console.log(sql2)

}

writeDB();

// hwLogin()
//     .then(result => console.log(result))
//     .catch(error => console.log(error))

// getStationData('NE=33987445')
//     .then(result => {
//         const obj = result[0]
//         const dataItemMap = obj.dataItemMap
//         const totalPower = dataItemMap['total_power'];
//         const dayPower = dataItemMap['day_power']
//         const sql = 'INSERT INTO TABLE (total-power, day-power) VALUES (' + totalPower + ',' + dayPower + ')'
//         const sql2 = `INSERT INTO TABLE (total-power, day-power) VALUES (${totalPower},${dayPower})`

//         console.log(sql2)
//     })
//     .catch(error => console.log(error))



