module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "nodejs": true,
    },
    "extends": [
        "eslint:recommended", 
        "plugin:require-path-exists/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "no-unused-vars": ["error", { "args": "none" }]
    }
};
