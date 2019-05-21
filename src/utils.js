function parse_point(point_string) {
    return point_string.split(",").map(parseFloat);
}

function parse_polyline(polyline_string) {
    return polyline_string.split("|").map(element => {
        return element.split(";").map(parse_point);
    });
}

exports.parse_point = parse_point;
exports.parse_polyline = parse_polyline;
