const Service = require("./Service");
const DistrictFetcher = require('./DistrictFetcher');

const KEY = "这里是你的 map key";
const China = "中华人民共和国";

new DistrictFetcher(new Service(KEY), {
    outputDir: '../dist',
    interval: 100
}).start(China);
