function prevPoint(point, mass, route) {
    if (mass[point]) {
        route.push(mass[point]);
        return prevPoint(mass[point], mass, route);
    } else {
        return route
    }
}

function nextNode(matrix, weights, nodeName, startP, routes) {
    let tempMatrix = null;
    tempMatrix = $.grep(matrix, function (item) {
        return (item.source === nodeName && item.target !== startP);
    });
    $.each(tempMatrix, function (key, value) {
        newDistance = weights[nodeName] + value.distance
        if ((weights[value.target] == null) || (weights[value.target] > newDistance)) {
            weights[value.target] = newDistance
            routes[value.target] = value.source
        }

        matrix = $.grep(matrix, function (item) {
            if (item.source === nodeName && item.target === value.target) {
                return false
            }
            if (item.target === nodeName && item.source === value.target) {
                return false
            }

            return true
        });
        let result = nextNode(matrix, weights, value.target, startP, routes);
        weights = result[0];
        routes = result[1];
    });

    return [weights, routes];
}

function generateCar() {
    let car = {
        speed: null,
        route: {
            start: null,
            finish: null
        },
        number: null,
        onRoad: false
    };
    let nodes = g.nodes.slice();
    car.speed = randomInteger(40, 80);
    car.route.start = nodes.splice(Math.floor(Math.random() * nodes.length), 1)[0];
    car.route.finish = nodes[Math.floor(Math.random() * nodes.length)];
    while (car.route.finish.id === car.route.start.id) {
        car.route.finish = nodes[Math.floor(Math.random() * nodes.length)];
    }
    car.number = generateCarNumber();
    return car;
}

function roadtrip(index, route, start = null, number = 0) {
    //console.log(route)
    let startEdge = start == null ? route.start : start;
    let finish = route.nodes[number];
    let currentEdge = $.grep(g.edges, function (item) {
        return ((item.source === startEdge && item.target === finish) || (item.source === finish && item.target === startEdge))
    });
    currentEdge = currentEdge[0];
    if (!currentEdge) {
        console.log(cars[index]);
    }
    let edgeTime = (currentEdge.distance / cars[index].speed) * 60 * minuteVsReal;

    refreshEdge(currentEdge);
    number += 1;
    setTimeout(() => {
        refreshEdge(currentEdge, false);
        if (number < route.nodes.length) {
            roadtrip(index, route, finish, number)
        } else {
            cars[index].onRoad = false;
            let nodes = g.nodes.slice();
            nodes = $.grep(nodes, function (item) {
                return item.id !== finish;
            });
            // console.log(nodes)
            cars[index].route.start = g.nodes.find(item => item === cars[index].route.finish);
            cars[index].route.finish = nodes[Math.floor(Math.random() * nodes.length)];
            while (cars[index].route.finish.id === cars[index].route.start.id) {
                cars[index].route.finish = nodes[Math.floor(Math.random() * nodes.length)];
            }
           // console.log(cars[index].number + ' ' + cars[index].onRoad + ' прибыла в пункт назначения!');
           // console.log(cars[index]);
        }

    }, edgeTime)
}

function refreshEdge(currentEdge, enter = true) {
    let edge = $.grep(g.edges, function (item) {
        return (item.id === currentEdge.id)
    });
    edge = edge[0];
    enter === true ? edge.cars += 1 : edge.cars -= 1;
}

function redrawEdge() {
    $.each(g.edges, (k,edge) => {
        if (edge.cars === 0) {
            edge.color = 'black';
        } else if (edge.cars <= 100) {
            edge.color = 'green';
        } else if (edge.cars > 100 && edge.cars < 200) {
            edge.color = 'blue';
        } else {
            edge.color = 'red';
        }
        sigmaInstance.refresh();
    })
}

function createRoute(index) {
    sNode = cars[index].route.start;
    tNode = cars[index].route.finish;
    let newDirection = $.grep(g.directions, function (item) {
        return ((item.start === sNode.id && item.finish === tNode.id)) //|| (item.start === tNode.id && item.finish === sNode.id))
    });
  //  console.log(newDirection, sNode, tNode, g.directions)
    return newDirection[0];
}


function generateDirections() {
    let tempArr = g.nodes.slice(0, g.nodes.length)
    console.log(tempArr)
    $.each(g.nodes, (k,start) => {
        // tempArr.splice(0,1)
        $.each(tempArr, (key,finish) => {
            if (start !== finish) {
                let result =  dijkstra(start.id, finish.id);
                let distance = result[0];
                let route = result[1];
                route = route.splice(1, route.length - 1);
                let newDirection = {
                    id: 'd' + g.directions.length,
                    start: start.id,
                    finish: finish.id,
                    distance: distance,
                    nodes: route,

                };
                g.directions.push(newDirection);
            }
        })
    })
}