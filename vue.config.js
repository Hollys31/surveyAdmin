module.exports = {
    publicPath: './',
    productionSourceMap: false,
    lintOnSave: false,
    devServer: {
        port: 8080,
        https: false,
        hotOnly: false,
        disableHostCheck: true,
        proxy: {
            '/api': {
                //target: 'http://192.168.2.74:9999',
                target: 'https://home.yufengtek.com',
                changeOrigin: true
            },
            '/upload': {
                //target: 'http://192.168.2.74:9999',
                target: 'https://home.yufengtek.com',
                changeOrigin: true
            },
        }
    }
}