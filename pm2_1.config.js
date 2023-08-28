module.exports = {
    apps: [{
        name: 'tool-solar',
        script: './ph4.js',
        watch: false,
        env: {
            NODE_ENV: 'production'
        }
    }]
};