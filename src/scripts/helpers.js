function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}

function dijkstra(startP, endP) {
    let matrix = g.edges.slice();
    let fullMatrix = matrix.slice();
    let weights = {};
    let prevRoutes = {};
    let route = [endP];
    $.each(matrix, function (k, v) {
        if (v.source !== startP) {
            fullMatrix.push({
                source: v.target,
                target: v.source,
                distance: v.distance
            })
        }
    });
    $.each(g.nodes, function (k, v) {
        weights[v.id] = null;
        prevRoutes[v.id] = null
    });
    let result = nextNode(fullMatrix, weights, startP, startP, prevRoutes);
    weights = result[0];
    prevRoutes = result[1];
    route = prevPoint(endP, prevRoutes, route);
 //   console.log(route);
    route.reverse();
    return [weights[endP], route]
}

function getRandNum() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return getRandNum(); // resample between 0 and 1
    return num;
}

function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function generateCarNumber() {
    let letters = ['A', 'B', 'C', 'E', 'H', 'K', 'M', 'O', 'P', 'T', 'X', 'Y'];
    let numbers = Math.floor(1 + Math.random() * (999 - 1 + 1));
    return letters[Math.floor(Math.random() * (letters.length))]
        + numbers.toString().padStart(3, '0')
        + letters[Math.floor(Math.random() * (letters.length))]
        + letters[Math.floor(Math.random() * (letters.length))]
        + '13'
}