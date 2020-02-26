


export const environment = {
    production: false,
    remoteConfig: true,
    remoteConfigUrl: './dashboard-config.json',
    VERSION: require('../../package.json').version,
    t2y12PruGU9wUtEGzBJfolMIgK: 'PAY:F-ANA:F-ACT:F-TRI:F-GRO:F-DEP:F-OPH:F-MTL:F-DGF:F-NAT:F',
    widgetUrl: 'http://localhost:4200/launch.js',
    botcredendialsURL: 'CHANGEIT',
    SERVER_BASE_URL: '/api/',
    CHAT_BASE_URL: '/chat/',
    testsiteBaseUrl: 'http://localhost:4200/assets/test_widget_page/index.html',
    wsUrl: 'ws://' + window.location.hostname + '/ws/?token=',
    firebase: {
        apiKey: 'CHANGEIT',
        authDomain: 'CHANGEIT',
        databaseURL: 'CHANGEIT',
        projectId: 'CHANGEIT',
        storageBucket: 'CHANGEIT',
        messagingSenderId: 'CHANGEIT',
        chat21ApiUrl: 'CHANGEIT'
    }
};
