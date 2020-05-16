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
        newDistance = weights[nodeName] + value.distance;
        if ((weights[value.target] == null) || (weights[value.target] > newDistance)) {
            weights[value.target] = newDistance
            routes[value.target] = value.source
        }

        matrix = $.grep(matrix, function (item) {
            if (item.source === nodeName && item.target === value.target) {
                return false
            }
            return !(item.target === nodeName && item.source === value.target);


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
        onRoad: false,
        length: null,
        distanceBetweenCars: null,
    };
    let nodes = g.nodes.slice();
    car.speed = randomInteger(40, 80);
    car.length = randomInteger(4, 10);
    car.distanceBetweenCars = Math.random() * 2 + 0.5;
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
    cars[index].speed = randomInteger(roadClasses[currentEdge.class].minSpeed, roadClasses[currentEdge.class].maxSpeed) * currentEdge.bandwidth;
    let edgeTime = (currentEdge.distance / (cars[index].speed)) * 60 * minuteVsReal;

    refreshEdge(currentEdge, cars[index]);
    number += 1;
    roadTripTimeOut = setTimeout(() => {
        refreshEdge(currentEdge, cars[index], false);
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
        }

    }, edgeTime)
}

function refreshEdge(currentEdge, car, enter = true) {
    let edge = $.grep(g.edges, function (item) {
        return (item.id === currentEdge.id)
    });
    edge = edge[0];
    if (enter) {
        edge.cars += 1;
        edge.drawing[hours][hours].carsAmount += 1;
        edge.load += car.length + car.distanceBetweenCars;
        if (edge.drawing[hours][hours]["maxLoad"] < edge.load) {
            edge.drawing[hours][hours]["maxLoad"] = edge.load
        }
        //console.log(edge.load, edge.fullLength)
    } else {
        edge.cars -= 1;
        edge.load -= car.length + car.distanceBetweenCars
    }

    if (edge.isActive) {
        let modalEdgeProgress = document.getElementById('modal-edge-progress');
        modalEdgeProgress.max = edge.fullLength;
        modalEdgeProgress.value = edge.load;
    }
}

function redrawEdge() {
    $.each(g.edges, (k, edge) => {
        let loadCoef = edge.load / edge.fullLength;
        // console.log(edge.load, edge.fullLength);
        if (edge.cars === 0) {
            edge.color = 'black';
        } else if (loadCoef > 0 && loadCoef < 0.25) {
            edge.color = 'green';
        } else if (loadCoef >= 0.25 && loadCoef < 0.5) {
            edge.color = 'yellow';
        } else if (loadCoef >= 0.5 && loadCoef < 0.75) {
            edge.color = 'orange';
        } else if (loadCoef >= 0.75 && loadCoef <= 0.9) {
            edge.color = 'red';
        } else if (loadCoef >= 0.9) {
            edge.color = 'pink';
            console.log('перегруз ' + edge.id);
            edge.drawing[hours][hours].overload += 1.67;
            edge.points += 0.017
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
    g.directions = [];
    let spanDirections = document.getElementById('directions-amount');
    for (const start of g.nodes) {
        let tempArr = g.nodes.slice(0, g.nodes.length);
        tempArr.forEach((finish) => {
            if (start !== finish) {
                generateDirection(start, finish);
                // console.log(g.directions.length);
                // spanDirections.innerText = 'Сгенерировано маршрутов: ' + g.directions.length;
            }
        });
    }
    g.directions = $.grep(g.directions, (elem) => {
        return elem.distance !== null;
    });
    showNotification('Сгенерировано ' + g.directions.length + ' маршрутов.');
    document.getElementById('generate-directions').removeAttribute('disabled');
    document.getElementById('start-app-btn').removeAttribute('disabled');
}

function generateDirection(start, finish) {
    let result = dijkstra(start.id, finish.id);
    let distance = result[0];
    let route = result[1];
    route = route.splice(1, route.length - 1);
    let newDirection = {
        id: 'd' + g.directions.length,
        start: start.id,
        finish: finish.id,
        distance: distance,
        nodes: route,
        edges: [],
        allNodes: []
    };
    let tempNodes = newDirection.nodes.slice();
    tempNodes.unshift(start.id);
    newDirection.allNodes = tempNodes.slice();
    //console.log(tempNodes);
    for (let i = 0; i <= tempNodes.length - 1; ++i) {
        let edge = $.grep(g.edges, function (item) {
            return ((item.source === tempNodes[i] && item.target === tempNodes[i + 1]) || (item.target === tempNodes[i] && item.source === tempNodes[i + 1]))
        });
        edge = edge[0];
        if (edge) {
            newDirection.edges.push(edge.id);
        }
    }
    g.directions.push(newDirection);
}