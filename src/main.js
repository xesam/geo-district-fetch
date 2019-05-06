//https://restapi.amap.com/v3/config/district?keywords=北京&subdistrict=2&key=<用户的key>
const axios = require("axios");

cosnt KEY = "212dafff51f98079d8935be29d4baee9";

axios
    .get('https://restapi.amap.com/v3/config/district', {
        params: {
            key: KEY,
            subdistrict: 1,
            keywords: "北京"
        }
    })
    .then(res => {
        console.log(res);
    })
    .catch(e => {
        console.error(e);
    });
