map.on('click', function (e) {
    if (isEditable) {
        nodesNumber += 1;
        let newNode = {
            id: 'n' + nodesNumber,
            label: 'node' + nodesNumber,
            x: Math.random(),
            y: Math.random(),
            lat: e.latlng.lat, // mandatory field
            lng: e.latlng.lng, // mandatory field
            size: 5,
            color: '#000'
        };
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let tbody = document.getElementById('list-nodes');
        let simulationModelStat = document.getElementById('simulation-model-stat');

        simulationModelStat.children[0].children[0].innerText = nodesNumber;

        sigmaInstance.graph.addNode(newNode);

        td1.innerText = newNode.id;
        td2.innerText = newNode.label;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tbody.appendChild(tr);

        $('#source-nodes, #target-nodes').append(new Option(newNode.label, newNode.id));
        //$('#start-nodes, #finish-nodes').append(new Option(newNode.label, newNode.id));
        // a = $('<a class="node-link" href="#" data-node="' + newNode.id + '">X</a>');
        // a.click(function () {
        //     g.edges = $.grep(g.edges, (function (elem) {
        //         if (elem.target === newNode.id || elem.source === newNode.id) {
        //             $('.tedges').find('tr[data-trEdgeTarget="' + newNode.id + '"]').remove()
        //             $('.tedges').find('tr[data-trEdgeSource="' + newNode.id + '"]').remove()
        //             return false
        //         } else {
        //             return true
        //         }
        //     }));
        //
        //     let nodeValue = $(this).data('node');
        //
        //     g.nodes = $.grep(g.nodes, function (item) {
        //         return (nodeValue !== item.id)
        //     })
        //
        //     g.edges = $.grep(g.edges, function (item, i) {
        //         return (nodeValue !== item.id)
        //     })

        //     sigmaInstance.graph.dropNode($(this).data('node'));
        //     leafletPlugin.syncNodes();
        //     $(this).closest('tr').remove();
        //     resetSelects();
        // });
        g.nodes.push(newNode);
        leafletPlugin.syncNodes((newNode.id).toString());
        // Fit the view to the graph
        leafletPlugin.fitBounds();
    }
});

document.getElementById('addEdge').addEventListener('click', (e) => {
    e.preventDefault();
    sNode = g.nodes.find(item => item.id === $('#source-nodes').val());
    tNode = g.nodes.find(item => item.id === $('#target-nodes').val());
    distance = distanceInKmBetweenEarthCoordinates(sNode.lat, sNode.lng, tNode.lat, tNode.lng);
    let newEdge = {
        id: 'e' + g.edges.length,
        source: sNode.id,
        target: tNode.id,
        distance: distance,
        color: 'black',
        class: 6,
        pavementType: 1,
        quality: 2,//randomInteger(1, 5),
        load: 0,
        cars: 0,
        reductionFactor: 1,
        accidentCoefficientNerf: 1,
        speedCoefficientNerf: 1,
        hasAccidents: [
            {name: 'Авария', has: 0,},
            {name: 'Ремонт дороги', has: 0},
            {name: 'Препятствие (поломанный автомобиль)', has: 0}
        ],
        drawing: [
            {0: {'time': 0, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {1: {'time': 1, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {2: {'time': 2, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {3: {'time': 3, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {4: {'time': 4, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {5: {'time': 5, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {6: {'time': 6, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {7: {'time': 7, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {8: {'time': 8, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {9: {'time': 9, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {10: {'time': 10, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {11: {'time': 11, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {12: {'time': 12, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {13: {'time': 13, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {14: {'time': 14, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {15: {'time': 15, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {16: {'time': 16, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {17: {'time': 17, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {18: {'time': 18, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {19: {'time': 19, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {20: {'time': 20, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {21: {'time': 21, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {22: {'time': 22, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}},
            {23: {'time': 23, 'carsAmount': 0, 'edgeFullLength': 0, 'maxLoad': 0, 'overload': 0}}
        ],
    };

    newEdge.bandwidth = qualityTypes[newEdge.quality].coef;
    newEdge.fullLength = roadClasses[newEdge.class].laneNumber * newEdge.distance * 1000;

    newEdge.reductionFactor = qualityTypes[newEdge.quality].coef * pavementTypes[newEdge.pavementType].coef * newEdge.accidentCoefficientNerf;

    let tbodyEdges = document.getElementById('list-edges');
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td')
    let btn = document.createElement('button');
    let btn2 = document.createElement('button');
    let btn3 = document.createElement('button');

    let b1 = document.createElement('b');
    let b2 = document.createElement('b');
    let b3 = document.createElement('b');
    let b4 = document.createElement('b');
    let b5 = document.createElement('b');


    // let td5 = document.createElement('td');
    // let td6 = document.createElement('td');
    btn.innerText = newEdge.id;
    td2.innerText = newEdge.source;
    td3.innerText = newEdge.target;

    btn2.innerText = '✎';
    btn2.style.transform = 'scaleX(-1)';
    btn2.classList = 'edit-edge-info';
    btn2.id = 'edit-edge-info-' + newEdge.id;

    btn3.innerText = '×';
    btn3.id = 'delete-edge-info-' + newEdge.id;
    btn3.classList = 'delete-edge-info';

    // btn3.addEventListener("click", ev => {
    //     let newDirections = $.grep(g.directions, (elem) => {
    //         return (elem.nodes.indexOf(newEdge.source) || elem.nodes.indexOf(newEdge.target));
    //     });
    //     showNotification('Удалено ' + newDirections.length + ' маршрута(-ов)');
    //     showNotification('Удалено ребро ' + newEdge.id);
    //     g.directions = newDirections;
    //     g.edges = $.grep(g.edges, (elem) => {
    //         return (elem !== newEdge);
    //     });
    //     tbodyEdges.removeChild(tr);
    //     console.log(newDirections);
    //
    //     sigmaInstance.graph.dropEdge(newEdge.id);
    //     sigmaInstance.refresh();
    //     leafletPlugin.fitBounds();
    // });

    btn2.addEventListener("click", ev => {
        let modalEdgeEditOuter = document.getElementById('modal-edge-edit-outer');
        let modalEdgeEdit = document.getElementById('modal-edge-edit');
        let modalEdgeEditHeader = document.getElementById('modal-edge-edit-header');
        let modalEdgeEditBody = document.getElementById('modal-edge-edit_body');
        let modalEdgeEditFooter = document.getElementById('modal-edge-edit-footer');
        let modalEdgeEditFooterCancel = document.getElementById('modal-edge-edit-footer-cancel');
        let edgeNewParametersQuality = document.getElementById('edge-new-parameters-quality');
        let edgeNewParametersQualityQuality = document.getElementById('edge-new-parameters-quality-quality');
        let edgeNewParametersQualityPavement = document.getElementById('edge-new-parameters-quality-pavement');

        console.log('clicked');
        edgeNewParametersQuality.value = newEdge.class;
        edgeNewParametersQualityQuality.value = newEdge.quality;
        edgeNewParametersQualityPavement.value = newEdge.pavementType;
        modalEdgeEditOuter.style.display = 'flex';
        changeEdgeClass(newEdge.class);
        sayVerdict(newEdge.reductionFactor);
        newEdge.isActiveEdit = true
    });

    btn.classList = 'show-edge-info';
    btn.id = 'show-edge-info-' + newEdge.id;
    btn.addEventListener("click", (e) => {
        let edgeInfoOuter = document.getElementById('modal-edge-info-outer');
        let edgeInfo = document.getElementById('modal-edge-info');
        let modalEdgeBodyLength = document.getElementById('modal-edge_body-length');
        let modalEdgeBodyLane = document.getElementById('modal-edge_body-lane');
        let modalEdgeBodyQuality = document.getElementById('modal-edge_body-quality');
        let modalEdgeProgress = document.getElementById('modal-edge-progress');
        let modalEdgeBody = document.getElementById('modal-edge_body');
        let modalEdgeBodyTypeName = document.getElementById('modal-edge_body-type-name');
        let modalEdgeBodyTypeGround = document.getElementById('modal-edge_body-type-ground');
        let modalEdgeBodyTypeMinSpeed = document.getElementById('modal-edge_body-type-min-speed');
        let modalEdgeBodyTypeMaxSpeed = document.getElementById('modal-edge_body-type-max-speed');


        modalEdgeBodyTypeName.innerText = roadClasses[newEdge.class].name;

        modalEdgeBodyTypeGround.innerText = pavementTypes[newEdge.pavementType].name;
        modalEdgeBodyTypeMinSpeed.innerText = roadClasses[newEdge.class].minSpeed + ' км/ч';
        modalEdgeBodyTypeMaxSpeed.innerText = roadClasses[newEdge.class].maxSpeed + ' км/ч';

        edgeInfoOuter.style.display = 'flex';
        modalEdgeBodyLength.innerText = newEdge.distance.toFixed(2) + 'км.';
        modalEdgeBodyLane.innerText = roadClasses[newEdge.class].laneNumber;
        modalEdgeBodyQuality.innerText = qualityTypes[newEdge.quality].name;
        newEdge.isActive = true;

        if (edgeInfoOuter.style.display === 'flex') {
            modalEdgeProgress.max = newEdge.fullLength;
            modalEdgeProgress.value = newEdge.load;
        }
        let edgeLabels = [];
        let edgeData = [];
        let edgeDataOverload = [];
        let edgeDataFullLength = [];
        console.log(newEdge.fullLength);
        newEdge.drawing.forEach((val, k) => {
            edgeLabels.push(val[k].time + ':00');
            edgeData.push(val[k].carsAmount);
            edgeDataOverload.push(val[k].overload);
            edgeDataFullLength.push(newEdge.fullLength);
        });

        drawChartForEdge(edgeLabels, edgeData, modalEdgeCanvas);
        drawBarChartForEdge(edgeLabels, edgeDataOverload, barChartForEdge);
        drawEdgeRadarChart(edgeLabels, edgeDataFullLength, edgeRadarChart);

        if (newEdge.isActive) {
            edgeRefreshInterval = setInterval(() => {
                updateEdgeRadarChart(newEdge.drawing[hours][hours].overload, hours, edgeRadarChart);
                updateChartForEdge(newEdge.drawing[hours][hours].carsAmount, hours, modalEdgeCanvas);
                updateBarChartForEdge(newEdge.drawing[hours][hours].overload, hours, barChartForEdge);
                console.log(newEdge.drawing[hours][hours].carsAmount, newEdge.id)
            }, 1500);
        }
        // edgeInfo
    });

    td1.appendChild(btn);
    td4.appendChild(btn2);
    td5.appendChild(btn3);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tbodyEdges.appendChild(tr);
    sigmaInstance.graph.addEdge(newEdge);
    g.edges.push(newEdge);
    let simulationModelStat = document.getElementById('simulation-model-stat');
    simulationModelStat.children[1].children[0].innerText = g.edges.length;
    sigmaInstance.refresh();
    leafletPlugin.fitBounds();
    showNotification('Ребро успешно добавлено');
});
