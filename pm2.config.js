module.exports = {
    apps: [{
        name: 'tool-solar',
        script: './ph3.js',
        watch: false,
        env: {
            NODE_ENV: 'production'
        }
    }]
};