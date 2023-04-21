import bull from 'bull'

export const queue = new bull('request-open-ia', {
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USERNAME
    },
    limiter: {
        max: 1,
        duration: 5000 
    }
})