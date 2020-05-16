function runApp() {
    document.getElementById('start-app-btn').setAttribute('disabled', 'disabled');
    if (run === false) {
        cars = [];
        for (let i = 0; i < carsInCity; i++) {
            let car = generateCar();
            cars.push(car)
        }
    }
    if (checkEngine()) {
        run = !run;
        startDay();
    } else {
        alert('Не все точки соединены!');
    }

}

function carsToStart() {
    return Math.floor(carsInCity * roadCoefs[hours] * (1 - 0.15 * Math.random())) - isCarOnRoad();
}

function runCars() {
    let carsAmount = carsToStart();
    // console.log(carsAmount);
    let carsToRoad = [];
    while (carsToRoad.length < carsAmount && carsAmount > 0) {
        let index = Math.floor(Math.random() * cars.length);
        cars[index].onRoad === false ? (carsToRoad.push(index), cars[index].onRoad = true) : null;
    }
    carsToRoad.length ? runEachCar(carsToRoad) : null
}

function runEachCar(carsToRoad) {
    $.each(carsToRoad, (k, car) => {
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
    $("#worldTimer, #worldTimer1").text(hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0"));
    setTimeout(() => {
        runCars();
        redrawEdge();
        $('#carsOnMap, #carsOnMap1').text(isCarOnRoad());
        minutes += 1;
        minutes === 60 ? (hours += 1, minutes = 0) : null;
        hours >= 24 ? hours = 0 : null;
        startDay();
    }, minuteVsReal)
}