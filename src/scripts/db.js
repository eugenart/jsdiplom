function deleteModel(modelName) {
    firebase.database().ref('graphs/' + modelName).remove().then(() => {
        console.log(modelName + ' была удалена');
    });
    return 0;
}

document.getElementById('save-current-model').addEventListener(("click"), () => {
    firebase.database().ref('graphs/' + tempModelParameters.name).set({
        graph: JSON.stringify(g),
        modelParameters: JSON.stringify(tempModelParameters)
    }).then(() => {
        showNotification('Модель ' + tempModelParameters.name + ' сохранена');
        console.log(g, tempModelParameters)
    });
});

function saveModel() {
    // let modelName = $('#saveName').val();
    // if (modelName) {
    firebase.database().ref('graphs/' + modelToSave.name).set({
        graph: JSON.stringify(g),
        modelParameters: JSON.stringify(modelToSave)
    }).then(() => {
        let childrenNodes = Array.from(document.getElementById('models').children);
        childrenNodes.forEach((k, v) => {
            if (v !== 0) {
                document.getElementById('models').removeChild(k)
            }
        });
        loadAllModels();
    });
    //     loadModels()
    // }
    // $('#saveName').empty();
}

function loadModel() {
    firebase.database().ref('graphs/' + currentGeneratingModel).once('value').then(function (data) {
        g = null;
        g = JSON.parse(data.val().graph);
        let modelstat = JSON.parse(data.val().modelParameters);
        let tempArrGraph = [],
            graphsLabels = [],
            graphsData = [];

        let liNames = ['Вершин: ', 'Рёбер: ', 'Маршрутов: '];
        tempArrGraph.push(g.nodes.length, g.edges.length, g.directions.length);

        let simulationModelName = document.getElementById('simulation-model-name');
        let simulationModelIntensity = document.getElementById('simulation-model-intensity-b');
        let simulationModelStat = document.getElementById('simulation-model-stat');
        let tbody = document.getElementById('list-nodes');
        let tbodyEdges = document.getElementById('list-edges');
        let carsCity = document.getElementById('cars-in-city');

        let edgeInfoOuter = document.getElementById('modal-edge-info-outer');
        let edgeInfo = document.getElementById('modal-edge-info');

        simulationModelName.innerText = modelstat.name;
        simulationModelIntensity.innerText = modelstat.intensityName;
        carsCity.innerText = carsInCity;

        if (!g.directions.length) {
            document.getElementById('start-app-btn').setAttribute('disabled', 'disabled');
            console.log('disabled');
        }

        liNames.forEach((value, key) => {
            let span = document.createElement('span');
            let b = document.createElement('b');

            span.innerText = value;

            b.innerText = tempArrGraph[key];

            span.appendChild(b);
            simulationModelStat.appendChild(span)
        });

        modelstat.intensity.forEach((v, k) => {
            graphsLabels.push(v[k].time);
            graphsData.push(v[k].coef);
        });

        drawChartForModel(graphsLabels, graphsData, myChartForModel);

        g.nodes.forEach((v, k) => {
            let option = document.createElement('option');
            let tr = document.createElement('tr');
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            let btn = document.createElement('button');

            btn.innerText = '×';
            btn.id = 'delete-edge-info-' + v.id;
            btn.classList = 'delete-edge-info';

            btn.addEventListener("click", ev => {
                let newDirections = $.grep(g.directions, direction => {
                    return !(direction.allNodes.includes(v.id));
                });
                showNotification('Удалено ' + (g.directions.length - newDirections.length) + ' маршрута(-ов)');
                g.directions = newDirections.slice();
                let newEdges = [];
                let newEdgesToDelete = [];
                newEdges = $.grep(g.edges, edge => {
                    return !(edge.source === v.id || edge.target === v.id);
                });
                newEdgesToDelete = $.grep(g.edges, edge => {
                    return (edge.source === v.id || edge.target === v.id);
                });
                showNotification('Удалено ' + (g.edges.length - newEdges.length) + ' ребра');
                g.edges = newEdges.slice();
                if (newEdgesToDelete.length) {
                    newEdgesToDelete.forEach((value, index) => {
                        document.getElementById('list-edges').removeChild(document.getElementById('data-edge-id-' + value.id));
                        sigmaInstance.graph.dropEdge(value.id);
                    });
                }

                g.nodes = $.grep(g.nodes, node => {
                    return (node.id !== v.id);
                });

                sigmaInstance.graph.dropNode(v.id);
                sigmaInstance.refresh();

                if (g.nodes.length !== 0) {
                    leafletPlugin.fitBounds();
                }

                tbody.removeChild(tr);
            });

            nodesNumber += 1;
            sigmaInstance.graph.addNode(v);

            td1.innerText = v.id;
            td2.innerText = v.label;

            option.text = v.label;
            option.value = v.id;

            td3.appendChild(btn);

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            tbody.appendChild(tr);

            $('#source-nodes, #target-nodes').append(new Option(v.label, v.id));
        });

        $.each(g.edges, function (k, v) {
            let option = document.createElement('option');
            let tr = document.createElement('tr');
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            let td4 = document.createElement('td');
            let td5 = document.createElement('td');

            let btn = document.createElement('button');
            let btn2 = document.createElement('button');
            let btn3 = document.createElement('button');

            let b1 = document.createElement('b');
            let b2 = document.createElement('b');
            let b3 = document.createElement('b');
            let b4 = document.createElement('b');


            // let td4 = document.createElement('td');
            // let td5 = document.createElement('td');
            // let td6 = document.createElement('td');
            btn.innerText = v.id;
            td2.innerText = v.source;
            td3.innerText = v.target;
            btn2.innerText = '✎';
            btn2.style.transform = 'scaleX(-1)';
            btn2.classList = 'edit-edge-info';
            btn2.id = 'edit-edge-info-' + v.id;
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
                edgeNewParametersQuality.value = v.class;
                edgeNewParametersQualityQuality.value = v.quality;
                edgeNewParametersQualityPavement.value = v.pavementType;
                modalEdgeEditOuter.style.display = 'flex';
                changeEdgeClass(v.class);
                sayVerdict(v.reductionFactor, v.speedCoefficientNerf);
                v.isActiveEdit = true
            });

            btn.classList = 'show-edge-info';
            btn.id = 'show-edge-info-' + v.id;
            btn.addEventListener("click", (e) => {
                let modalEdgeBodyLength = document.getElementById('modal-edge_body-length');
                let modalEdgeBodyLane = document.getElementById('modal-edge_body-lane');
                let modalEdgeBodyQuality = document.getElementById('modal-edge_body-quality');
                let modalEdgeProgress = document.getElementById('modal-edge-progress');
                let modalEdgeBodyTypeName = document.getElementById('modal-edge_body-type-name');
                let modalEdgeBodyTypeGround = document.getElementById('modal-edge_body-type-ground');
                let modalEdgeBodyTypeMinSpeed = document.getElementById('modal-edge_body-type-min-speed');
                let modalEdgeBodyTypeMaxSpeed = document.getElementById('modal-edge_body-type-max-speed');
                let edgeNewParametersQualityPavement = document.getElementById('edge-new-parameters-quality-pavement');

                edgeInfoOuter.style.display = 'flex';
                edgeNewParametersQualityPavement.value = v.pavementType;
                modalEdgeBodyTypeName.innerText = roadClasses[v.class].name;
                modalEdgeBodyTypeGround.innerText = pavementTypes[v.pavementType].name;
                modalEdgeBodyTypeMinSpeed.innerText = roadClasses[v.class].minSpeed + ' км/ч';
                modalEdgeBodyTypeMaxSpeed.innerText = roadClasses[v.class].maxSpeed + ' км/ч';
                modalEdgeBodyLength.innerText = v.distance.toFixed(2) + ' км.';
                modalEdgeBodyLane.innerText = roadClasses[v.class].laneNumber;
                modalEdgeBodyQuality.innerText = qualityTypes[v.quality].name;
                v.isActive = true;
                if (edgeInfoOuter.style.display === 'flex') {
                    modalEdgeProgress.max = v.fullLength;
                    modalEdgeProgress.value = v.load;

                }
                let edgeLabels = [];
                let edgeData = [];
                let edgeDataOverload = [];
                let edgeDataFullLength = [];
                v.drawing.forEach((val, k) => {
                    edgeLabels.push(val[k].time + ':00');
                    edgeData.push(val[k].carsAmount);
                    edgeDataOverload.push(val[k].overload);
                    edgeDataFullLength.push(v.fullLength);
                });
                drawChartForEdge(edgeLabels, edgeData, modalEdgeCanvas);
                drawBarChartForEdge(edgeLabels, edgeDataOverload, barChartForEdge);
                drawEdgeRadarChart(edgeLabels, edgeDataFullLength, edgeRadarChart);

                if (v.isActive) {
                    edgeRefreshInterval = setInterval(() => {
                        updateChartForEdge(v.drawing[hours][hours].carsAmount, hours, modalEdgeCanvas);
                        updateEdgeRadarChart(v.drawing[hours][hours].maxLoad, hours, edgeRadarChart);
                        updateBarChartForEdge(v.drawing[hours][hours].overload, hours, barChartForEdge);
                        console.log(v.drawing[hours][hours].carsAmount, v.id)
                    }, 1500);
                }
                // edgeInfo
            });

            btn3.innerText = '×';
            btn3.id = 'delete-edge-info-' + v.id;
            btn3.classList = 'delete-edge-info';

            btn3.addEventListener("click", ev => {
                // console.log(v.source, v.target);

                let newDirections = $.grep(g.directions, direction => {
                    return (!direction.edges.includes(v.id));
                });

                showNotification('Удалено ' + (g.directions.length - newDirections.length) + ' маршрута(-ов)');
                showNotification('Удалено ребро ' + v.id);

                g.directions = newDirections.slice();

                g.edges = $.grep(g.edges, (elem) => {
                    return (elem !== v);
                });
                tbodyEdges.removeChild(tr);

                sigmaInstance.graph.dropEdge(v.id);
                sigmaInstance.refresh();
                leafletPlugin.fitBounds();
            });

            tr.id = 'data-edge-id-' + v.id;

            td1.appendChild(btn);
            td4.appendChild(btn2);
            td5.appendChild(btn3);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);

            tbodyEdges.appendChild(tr);
            sigmaInstance.graph.addEdge(v);

        });
        if (g.edges.length || g.nodes.length) {
            leafletPlugin.fitBounds();
            sigmaInstance.refresh()
            sigma.plugins.relativeSize(sigmaInstance, 1);
        }
    });


}

function loadAllModels() {
    let helloDiv = document.getElementById('hello_inner');
    let uploadModelDiv = document.getElementById('upload_model');
    let modelsEl = document.getElementById('models');
    let confirm_modal_footer_confirm = document.getElementById('confirm_modal_footer_confirm');

    let liNames = ['Вершин: ', 'Рёбер: ', 'Маршрутов: ', 'Режим: '];

    helloDiv.style.display = 'none';
    uploadModelDiv.style.display = 'flex';

    firebase.database().ref('graphs/').once('value').then(function (data) {
        data.forEach(function (child) {
            let model = document.createElement('div');
            let model_name = document.createElement('span');
            let hr = document.createElement('hr');
            let a = document.createElement('a');
            let model_parameters = document.createElement('ul');
            let button = document.createElement('button');

            let tempArrGraph = [];

            let tempGraph = JSON.parse(child.val().graph);
            tempModelParameters = JSON.parse(child.val().modelParameters);


            tempArrGraph.push(tempGraph.nodes.length, tempGraph.edges.length, tempGraph.directions.length, tempModelParameters.intensityName);


            model.classList = 'model_to_chose';
            model.setAttribute('data-model-name', child.key);

            model_name.classList = 'model_name';
            model_name.innerText = child.key;

            a.innerText = ' ×';
            // a.setAttribute('data-model', child.key);
            a.classList = 'delete_link';
            a.addEventListener("click", (e) => {
                // modelsEl.removeChild(model);
                confirm_modal_footer_confirm.setAttribute('data-model', child.key);
                document.getElementById('modal_outer').style.display = 'flex'
            });

            model_parameters.classList = 'model_parameters';

            button.innerText = 'Выбрать';
            button.addEventListener("click", (e) => {
                currentGeneratingModel = child.key;
                console.log(currentGeneratingModel + ' выбрана');
                document.getElementById('hello').style.display = 'none';
                document.getElementById('map-container').style.visibility = 'visible';
                document.getElementById('graph-container').style.visibility = 'visible';
                document.getElementById('main-container').style.visibility = 'visible';
                showNotification('Выбрана модель ' + currentGeneratingModel);
                loadModel()
            });

            modelsEl.appendChild(model);
            model.appendChild(model_name);
            model_name.appendChild(a);
            model.appendChild(hr);
            model.appendChild(model_parameters);
            model.appendChild(button);

            liNames.forEach((value, key) => {
                let li = document.createElement('li');
                let span = document.createElement('span');
                let b = document.createElement('b');

                span.innerText = value;

                b.innerText = tempArrGraph[key];

                li.appendChild(span);
                li.appendChild(b);
                model_parameters.appendChild(li)
            });
        })
    })
}
