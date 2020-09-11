const Service = require("./Service");
const DistrictFetcher = require('./DistrictFetcher');

if (!module.parent) {
    /**
     * node ./main xxxxxx 中华人民共和国
     * */
    const [node, script, key, target] = process.argv;
    const service = new Service(key);
    new DistrictFetcher(service).start(target, {
        outputDir: '../dist',
        interval: 100
    });
}
