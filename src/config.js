module.exports = {
    
    port: process.env.PORT || 5000,
    
    mongo: {
        driver: process.env.MONGO_DRIVER || 'mongodb',
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT || 27017,
        user: process.env.MONGO_USER || 'root',
        password: process.env.MONGO_PASSWORD || 'root',
        database: process.env.MONGO_DATABASE || 'admin',
    },

    redis: {
        // depressive-disorders
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        auth: process.env.REDIS_PASS,
        options: {
          no_ready_check: false
        }
    },

    repository: 'https://eutils.ncbi.nlm.nih.gov/entrez',
}