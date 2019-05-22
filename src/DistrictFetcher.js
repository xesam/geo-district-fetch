const fs = require('fs');
const path = require('path');
const writeFile = require('write-file-promise');
const readFiles = require('read-files-promise');
const {Timer} = require('chelaile-timer');

const SKELETON_FILE_NAME = 'skeleton.json';

class DistrictGenerator {
    constructor(district) {
        this.district = district;
    }

    * gen(district) {
        if (district.districts.length > 0) {
            for (let d of district.districts) {
                yield* this.gen(d);
            }
        } else {
            yield {
                adcode: district.adcode,
                name: district.name
            };
        }
    }

    get() {
        return this.gen(this.district);
    }
}

class DistrictFetcher {
    constructor(service, options) {
        this.service = service;
        this.outputDir = options.outputDir;
        this.interval = options.interval;
    }

    getPath(file_name) {
        return path.resolve(`${this.outputDir}/${file_name}`)
    }

    getSkeletonPath() {
        return this.getPath(SKELETON_FILE_NAME);
    }

    getDistrictPath(district) {
        return this.getPath(`${district.adcode}.json`);
    }

    async start(root) {
        let skeleton = await this.fetchSkeleton(root);
        this.district = new DistrictGenerator(skeleton).get();
        this.timer = new Timer(this.interval, {
            onTick: (timer) => {
                timer.stop();
                let next = this.district.next();
                if (!next.done) {
                    this.fetchDistrict(next.value)
                        .then(() => {
                            timer.start();
                        })
                }
            }
        });
        this.timer.start();
    }

    async fetchSkeleton(root) {
        let targetFilePath = this.getSkeletonPath();
        let es = fs.existsSync(targetFilePath);
        if (es) {
            return await readFiles([targetFilePath], {encoding: 'utf8'}).then(JSON.parse);
        } else {
            let skeleton = await this.service.getSkeleton(root);
            return await writeFile(targetFilePath, JSON.stringify(skeleton));
        }
    }

    fetch(district) {
        return this.service.getDistrict(district.adcode);
    }

    save(targetFilePath, data) {
        return writeFile(targetFilePath, JSON.stringify(data));
    }

    async fetchDistrict(district) {
        let targetFilePath = this.getDistrictPath(district);
        let es = fs.existsSync(targetFilePath);
        if (!es) {
            let data = await this.fetch(district);
            return await this.save(targetFilePath, data);
        }
    }
}

module.exports = DistrictFetcher;
