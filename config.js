module.exports = () => {

    let environment = process.env.NODE_ENV || 'development';

    let configuration = {
        development: {
            environment: 'development',
            APP:{
                PORT: 8080,
                SERVER: 'windows'
            },
            DB:{
                DIALECT: 'mysql',
                HOST: 'localhost',
                PORT: 3306,
                USER: 'root',
                PASSWORD: '',
                DATABASE: 'veterinary_medical',
            },
            TOKEN:{
                KEY: "THIS_IS_A_TOKEN_KEY",
                ISSUER: "Identity - PITP Inc",
                EXPIRY: "24h",
            }
        },
        testing: {
            environment: 'testing',
            APP:{
                PORT: process.env.DEV_APP_PORT,
                SERVER: 'linux'
            },
            DB:{
                DIALECT: process.env.DEV_DB_DIALECT,
                HOST: process.env.DEV_DB_HOST,
                PORT: process.env.DEV_DB_PORT,
                USER: process.env.DEV_DB_USER,
                PASSWORD: process.env.DEV_DB_PASSWORD,
                DATABASE: process.env.DEV_DB_DATABASE,
            },
            TOKEN:{
                KEY: "THIS_IS_A_TOKEN_KEY",
                ISSUER: "Identity - PITP Inc",
                EXPIRY: "24h",
            }
        },
        production: {
            environment: 'production',
            APP:{
                PORT: 8081,
                SERVER: 'linux'
            },
            DB:{
                DIALECT: 'mysql',
                HOST: 'localhost',
                PORT: 3306,
                USER: 'hollxzdw_admin_veterinary',
                PASSWORD: 'admin_veterinary123',
                DATABASE: 'hollxzdw_veterinary_medical',
            },
            TOKEN:{
                KEY: "THIS_IS_A_TOKEN_KEY",
                ISSUER: "Identity - PITP Inc",
                EXPIRY: "24h",
            }
        },
    }

    return configuration[environment];

}