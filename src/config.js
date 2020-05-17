module.exports = {
    
    port: process.env.PORT || 5000,
    
    mongo: {
        driver: process.env.MONGO_DRIVER || 'mongodb+srv',
        host: process.env.MONGO_HOST || 'cluster0-dzvzr.gcp.mongodb.net',
        port: process.env.MONGO_PORT,
        user: process.env.MONGO_USER || 'admin',
        password: process.env.MONGO_PASSWORD || 'admin',
        database: process.env.MONGO_DATABASE || 'depressive-disorders',
    },

    redis: {
        // depressive-disorders
        host: process.env.REDIS_HOST || 'redis-17316.c84.us-east-1-2.ec2.cloud.redislabs.com',
        port: process.env.REDIS_PORT || 17316,
        auth: process.env.REDIS_PASS || 'C4TrdXOVcZtwM8nCphiauGdotYSJHH9s',
        options: {
          no_ready_check: false
        }
    },

    repository: 'https://eutils.ncbi.nlm.nih.gov/entrez',
}