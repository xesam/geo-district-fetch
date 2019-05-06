function parse_polyline(polyline_string) {
    return polyline_string.split("|").map(element => {
        return element.split(";").map(ele => {
            return ele.split(",").map(parseFloat);
        });
    });
}
