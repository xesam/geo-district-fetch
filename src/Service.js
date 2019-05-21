const axios = require("axios");
const utils = require("./utils");

function flatten(districts) {
    if (!districts) {
        return [];
    }
    return districts.map(ele => {
        return {
            name: ele.name,
            adcode: ele.adcode,
            districts: flatten(ele.districts)
        }
    });
}

class Service {
    constructor(key) {
        this.key = key;
    }

    fetch(params) {
        return axios
            .get('https://restapi.amap.com/v3/config/district', {
                params: {
                    key: this.key,
                    ...params
                }
            })
            .then(res => {
                let data = res.data;
                if (data !== '10000') {
                    throw new Error(JSON.stringify(data));
                }
                return data;
            });
    }

    getSkeleton(name) {
        return this.fetch({
            subdistrict: 3,
            extensions: 'base',
            keywords: name
        }).then(data => {
            let district = data.districts[0];
            return {
                name: district.name,
                adcode: district.adcode,
                districts: flatten(district.districts)
            };
        });
    }

    getDistrict(adcode) {
        return this.fetch({
            subdistrict: 0,
            extensions: 'all',
            keywords: adcode
        }).then(data => {
            let district = data.districts[0];
            return {
                properties: {
                    name: district.name,
                    adcode: district.adcode,
                    center: utils.parse_point(district.center)
                },
                geometry: {
                    type: "MultiPolygon",
                    coordinates: utils.parse_polyline(district.polyline)
                }
            };
        });
    }
}

module.exports = Service;
