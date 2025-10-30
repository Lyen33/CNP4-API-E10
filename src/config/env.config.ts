export const EnvConfiguration = () => ({
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 3000,
    jwt_secret: process.env.JWT_SECRET,
    jwt_access_expiration: process.env.JWT_ACCESS_EXPIRATION,
    jwt_refresh_expiration: process.env.JWT_REFRESH_EXPIRATION
})
