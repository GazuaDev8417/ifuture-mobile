export const presets = ['babel-preset-expo'];
export const plugins = [
    ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
    }]
];
