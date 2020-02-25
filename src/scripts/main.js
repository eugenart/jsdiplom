let run = false,
    hours = 0,
    minutes = 0,
    minuteVsReal = 420, //420 - 10 минут реального времени
    roadCoefs = [0.08, 0.02, 0.01, 0.02, 0.06, 0.14, 0.27, 0.30, 0.52, 0.68, 0.99, 0.84, 0.74, 0.75, 0.83, 0.97, 0.99, 0.95, 0.79, 0.47, 0.26, 0.24, 0.19, 0.12],
    //roadCoefs = [0.68, 0.85, 0.99, 0.99, 0.06, 0.14, 0.27, 0.30, 0.52, 0.68, 0.99, 0.84, 0.74, 0.75, 0.83, 0.97, 0.99, 0.95, 0.79, 0.47, 0.26, 0.24, 0.19, 0.12],
    carsInCity = 10000,
    cars = [];

function runApp() {
    if (run === false) {
        cars = [];
        for (let i = 0; i < carsInCity; i++) {
            let car = generateCar();
            cars.push(car)
        }
    }
    checkEngine() ? (run = !run, startDay()) : alert('Не все точки соединены!');
}

function carsToStart() {
    return Math.floor(carsInCity * roadCoefs[hours] * (1 - 0.15 * Math.random())) - isCarOnRoad();
}

function runCars() {
    let carsAmount = carsToStart();
    console.log(carsAmount);
    let carsToRoad = []
    while(carsToRoad.length < carsAmount && carsAmount > 0) {
        let index = Math.floor(Math.random() * cars.length);
        cars[index].onRoad === false ? (carsToRoad.push(index), cars[index].onRoad = true) : null;
    }
    carsToRoad.length ? runEachCar(carsToRoad) : null
}

function runEachCar(carsToRoad) {
    $.each(carsToRoad, (k,car) => {
        let route = createRoute(car);
        roadtrip(car, route);
    })
}

function isCarOnRoad() {
    let count = 0;
    $.each(cars, (k, v) => {
        v.onRoad ? count += 1 : null
    });
    return count;
}

function checkEngine() {
    let pass = true;
    $.each(g.nodes, (k, v) => {
        let edges = $.grep(g.edges, function (item) {
            return (item.source === v.id || item.target === v.id)
        });
        if (edges.length === 0) {
            v.color = 'red';
            pass = false;
        } else {
            v.color = '#000';
        }
    });
    sigmaInstance.refresh();
    return pass;
}

function startDay() {
    $("#worldTimer").text(hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0"));
    setTimeout(() => {
        runCars();
        redrawEdge()
        $('#carsOnMap').text(isCarOnRoad());
        minutes += 1;
        minutes === 60 ? (hours += 1, minutes = 0) : null;
        hours >= 24 ? hours = 0 : null;
        startDay();
    }, minuteVsReal)
}