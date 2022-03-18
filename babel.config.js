const packageJSON = require('./package.json');

/** @type {import ('@babel/core').ConfigFunction} */
module.exports = (api) => {
    api.cache(true);

    const envPreset = [
        '@babel/env',
        {
            modules: false,
            targets: 'Chrome >= 98',
            bugfixes: true,
            useBuiltIns: 'usage',
            corejs: { version: packageJSON.devDependencies['core-js'].replace('^', '') },
        },
    ];

    return {
        sourceType: 'unambiguous',
        presets: ['@babel/preset-typescript', envPreset],
        plugins: [
            '@babel/plugin-transform-runtime',
        ],
        env: {
            development: {
                presets: [['@babel/preset-react', { runtime: 'automatic', development: true }]],
                // plugins: [require.resolve('react-refresh/babel')],
            },
            production: {
                presets: [['@babel/preset-react', { runtime: 'automatic' }]],
            },
        },
    };
};
