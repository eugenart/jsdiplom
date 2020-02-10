let run = false,
    hours = 0,
    minutes = 0,
    minuteVsReal = 210, //420 - 10 минут реального времени
    carGenerationDelay = minuteVsReal / 6,
    roadCoefs = [0.08, 0.02, 0.01, 0.02, 0.06, 0.14, 0.27, 0.30, 0.52, 0.68, 0.99, 0.84, 0.74, 0.75, 0.83, 0.97, 0.99, 0.95, 0.79, 0.47, 0.26, 0.24, 0.19, 0.12],
    //roadCoefs = [0.68, 0.85, 0.99, 0.99, 0.06, 0.14, 0.27, 0.30, 0.52, 0.68, 0.99, 0.84, 0.74, 0.75, 0.83, 0.97, 0.99, 0.95, 0.79, 0.47, 0.26, 0.24, 0.19, 0.12],
    carsInCity = 100000,
    carsOnMap = 0,
    cars = [],
    carsOnRoad = [],
    lastCarsAmount = 0;

function runApp() {
    if (run === false) {
        cars = [];
        for (let i = 0; i < carsInCity; i++) {
            let car = generateCar();
            cars.push(car)
        }
    }
    checkEngine() ? (run = !run, runCars(), startDay()) : alert('Не все точки соединены!');
}

function runCars() {
    // console.log('ran', roadCoefs[hours], hours);
    carsOnRoad = [];
    let carsAmount = Math.floor(carsInCity * roadCoefs[hours] * 0.1 * (Math.random() + 9));
    console.log('carsOnMap', carsOnMap);
    let carsToGenerate = carsAmount - isCarOnRoad();
    console.log('carsToGenerate', carsToGenerate);
    while (carsOnRoad.length < carsToGenerate) {
        let index = Math.floor(Math.random() * cars.length);
        cars[index].onRoad === false ? (carsOnRoad.push(index), cars[index].onRoad = true) : null;
    }
    runCar()
}

function runCar(index = 0) {
    if (index < carsOnRoad.length) {
        let route = createRoute(carsOnRoad[index]);
        roadtrip(carsOnRoad[index], route);
        // console.log(cars[carsOnRoad[index]].number + ' выехала!!!!!!');
        if (run === true) {
            setTimeout(() => {
                runCar(index + 1)
            }, Math.random() * minuteVsReal * 60 / carsOnRoad.length)
        }
    }
}

function isCarOnRoad() {
    let count = 0;
    $.each(cars, (k,v) => {
        v.onRoad ? count += 1 : null
    })
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
        minutes += 1;
        $('#carsOnMap').text(isCarOnRoad());
        console.log(isCarOnRoad())
        minutes === 60 ? (hours += 1, minutes = 0, runCars()) : null;
        hours > 24 ? hours = 0 : null;
        startDay()
    }, minuteVsReal)
}