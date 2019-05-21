const Service = require("./Service");
const DistrictFetcher = require('./DistrictFetcher');

const KEY = "212dafff51f98079d8935be29d4baee9";
const China = "中华人民共和国";

new DistrictFetcher(new Service(KEY), '../dist').start(China);

