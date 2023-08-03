const axios = require('axios');
require('dotenv').config()
const baseUrl = 'https://intl.fusionsolar.huawei.com/thirdData/'

const data = {
    userName: process.env.USER_NAME,
    systemCode: process.env.SYSTEM_CODE
}

// axios.post(baseUrl + 'login', data)
//     .then(result => console.log(result))
//     .catch(error => console.log(error))


function myFunction(word) {
    return new Promise((resolve, reject) => {
        if (word === 'OK') resolve("This is Correct")
        reject("This is Error")

    })

}

//callback
myFunction('OK', (err, result) => {
    if (err) console.log(err)
    console.log(result)
})


//promise
myFunction('aaa')
    .then(data => {
        console.log(data)
    })
    .catch(error => {
        console.log(error)
    })


//async await
async function worker() {
    const input = 'OK'
    try {
        const result = await myFunction(input)
        console.log(result)
    }
    catch (err) {
        console.log(err)
    }


}

