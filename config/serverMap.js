var configs = {
    //本地开发环境的接口地址(npm run dev)
    dev: {
        base: 'http://apidev.zhongxigo.com:8080/mallAdmin', //本地开发调试用的服务器地址，修改不会影响发布
        node_api: '//127.0.0.1:7001', //本地开发调试用的服务器地址，修改不会影响发布
    },
    //待发布的开发环境的接口地址(npm run build-dev)
    local: {
        base: 'http://apilocal.zhongxigo.com:8080/mallAdmin', //本地开发调试用的服务器地址，修改不会影响发布
        node_api: '//xxx-node.dev61.xxx.com',
    },
    //测试环境的接口地址
    test: {
        base: 'http://apitest.zhongxigo.com:8080/mallAdmin',
        node_api: '//bbb-node-service-test.xxx.com',
    },
    //生产环境的接口地址
    prod: {
        base: 'http://api.zhongxigo.com/mallAdmin',
        node_api: '//bbb-node-service.xxx.com',
    }
}
module.exports = configs[process.env.ENV_CONFIG]

