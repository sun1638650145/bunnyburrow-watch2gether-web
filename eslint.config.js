import js from '@eslint/js';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import globals from 'globals';

export default [
    // 预定义配置.
    js.configs.recommended, // 启用ESLint推荐规则.
    reactRecommended,
    {
        // 文件.
        files: ['**/*.{js,jsx}'], // 匹配js和jsx扩展名的目标文件.
        // 排除文件.
        ignores: ['**/*.config.js'], // 排除配置文件.
        // 语言选项.
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: 'module', // JavaScript源类型为ESM模块.
            // 全局变量.
            globals: {
                ...globals.browser, // 浏览器相关.
                ...globals.jest // Jest相关.
            }
        },
        // 规则.
        rules: {
            'eol-last': ['error', 'always'], // 文件末尾有换行.
            indent: ['error', 4], // 缩进4个空格.
            'linebreak-style': ['error', 'unix'], // 使用Unix换行符.
            'max-len': ['warn', 80], // 最大行长度80.
            quotes: ['error', 'single'], // 使用单引号.
            semi: ['error', 'always'] // 结尾处使用分号.
        },
        // 共享设置.
        settings: {
            react: {
                version: 'detect' // 自动检测安装的版本.
            }
        }
    }
];
