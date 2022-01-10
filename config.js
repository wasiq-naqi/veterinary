module.exports = () => {

    const defaultEnviornment = 'development'
    const environment = process.env.NODE_ENV || defaultEnviornment;

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
                DATABASE: 'hollxzdw_veterinary_medical',
            },
            TOKEN:{
                KEY: "THIS_IS_A_TOKEN_KEY",
                ISSUER: "Identity - PITP Inc",
                EXPIRY: "24h",
            }
        },
        staging: {
            environment: 'staging',
            APP:{
                PORT: 8082,
                SERVER: 'linux'
            },
            DB:{
                DIALECT: 'mysql',
                HOST: 'localhost',
                PORT: 3306,
                USER: 'hollxzdw_admin_veterinary',
                PASSWORD: 'admin_veterinary123',
                DATABASE: 'hollxzdw_veterinary_medical_dev',
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
                PORT: process.env.port || 8081,
                SERVER: process.env.server || 'linux'
            },
            DB:{
                DIALECT: process.env.db_dialect || 'mysql',
                HOST: process.env.db_host || 'localhost',
                PORT: process.env.db_port || 3306,
                USER: process.env.db_user || 'hollxzdw_admin_veterinary',
                PASSWORD: process.env.db_password || 'admin_veterinary123',
                DATABASE: process.env.db_database || 'hollxzdw_veterinary_medical',
            },
            TOKEN:{
                KEY: "THIS_IS_A_TOKEN_KEY",
                ISSUER: "Identity - PITP Inc",
                EXPIRY: "24h",
            }
        },
    }

    return configuration[environment] || configuration[defaultEnviornment];

}