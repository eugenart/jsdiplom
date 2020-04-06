document.getElementById('hello_btn').addEventListener('click', (e) => {
    loadAllModels();
});

document.addEventListener('DOMContentLoaded', evt => {
    document.getElementById('cars-in-city').value = carsInCity;
    let edgeNewParametersQuality = document.getElementById('edge-new-parameters-quality');
    let edgeNewParametersQualityPavement = document.getElementById('edge-new-parameters-quality-pavement');
    let edgeNewParametersQualityQuality = document.getElementById('edge-new-parameters-quality-quality');
    let edgeNerfCoefs = document.getElementById('edge-nerf-coefs');

    roadClasses.forEach((val, index) => {
        let option = document.createElement('option');
        option.text = val.name;
        option.value = Number(index);
        edgeNewParametersQuality.appendChild(option);
    });

    pavementTypes.forEach((val, index) => {
        let option = document.createElement('option');
        option.text = val.name;
        option.value = Number(index);
        edgeNewParametersQualityPavement.appendChild(option);
    });

    qualityTypes.forEach((val, index) => {
        let option = document.createElement('option');
        option.text = val.name;
        option.value = Number(index);
        edgeNewParametersQualityQuality.appendChild(option);
    });
    roadAccidents.forEach((val, index) => {
        let div = document.createElement('div');
        let input = document.createElement('input');
        let label = document.createElement('label');

        input.id = 'accident-' + index;
        input.type = 'checkbox';
        input.classList = 'switch';

        label.for = input.id;
        label.innerText = val.name;

        div.append(input, label);
        edgeNerfCoefs.appendChild(div);

        input.addEventListener("change", ev => {
            let edge = $.grep(g.edges, function (item) {
                return (item.isActiveEdit === true)
            });
            edge = edge[0];
            if (edge.hasAccidents[index].has === 0) {
                edge.hasAccidents[index].has = 1;

                // edge.speedCoefficientNerf = edge.speedCoefficientNerf * val.speedCoefNerf;
                // edge.bandwidth = qualityTypes[edge.quality].coef * edge.speedCoefficientNerf;

                edge.accidentCoefficientNerf = edge.accidentCoefficientNerf * val.bandwidthCoefNerf;
                edge.reductionFactor = qualityTypes[edge.quality].coef * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;
                edge.fullLength = qualityTypes[edge.quality].coef * roadClasses[edge.class].laneNumber * edge.distance * 1000 * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;


            } else {
                edge.hasAccidents[index].has = 0;

                // edge.bandwidth = qualityTypes[edge.quality].coef / edge.speedCoefficientNerf;
                // edge.speedCoefficientNerf = edge.speedCoefficientNerf / val.speedCoefNerf;

                edge.accidentCoefficientNerf = edge.accidentCoefficientNerf / val.bandwidthCoefNerf;
                edge.reductionFactor = qualityTypes[edge.quality].coef * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;
                edge.fullLength = qualityTypes[edge.quality].coef * roadClasses[edge.class].laneNumber * edge.distance * 1000 * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;
            }
            console.log(edge.reductionFactor, edge.accidentCoefficientNerf, edge.fullLength);
            sayVerdict(edge.reductionFactor);
        });
    })

});

document.getElementById('cars-in-city').addEventListener("change", ev => {
    carsInCity = document.getElementById('cars-in-city').value
});
//

document.getElementById('confirm_modal_footer_cancel').addEventListener("click", (ev => {
    document.getElementById('modal_outer').style.display = 'none';
    document.getElementById('confirm_modal_footer_confirm').removeAttribute('data-model')
}));

document.getElementById('confirm_modal_footer_confirm').addEventListener('click', (e) => {
    let modelName = document.getElementById('confirm_modal_footer_confirm').getAttribute('data-model');
    deleteModel(modelName);
    document.getElementById('modal_outer').style.display = 'none';
    document.querySelector(`[data-model-name="${modelName}"]`).remove();
});

document.getElementById('new_model_input').addEventListener('keyup', function (e) {
    if (this.value.length < 3) {
        document.getElementById('create_new_model').setAttribute('disabled', 'disabled')
    } else {
        document.getElementById('create_new_model').removeAttribute('disabled');
        console.log(this.value)
    }
});

function showNotification(text) {
    let noteOuter = document.getElementById('notification-container');
    let note = document.createElement('div');
    note.innerText = text;
    note.classList = 'notification';
    noteOuter.appendChild(note);
    setTimeout(() => {
        note.style.display = 'none';
        note.remove();
    }, 5000);
}


document.getElementById('create_new_model').addEventListener("click", function () {
    document.getElementById('model-modal-outer').style.display = 'flex';
    let intensityArray = document.getElementById('intensity-array');
    let modelHeaderName = document.getElementById('model-modal-header-name');
    let intensitySelect = document.getElementById('intensity-select');

    modelToSave.intensityName = 'Бимодальный';
    currentGeneratingModel = document.getElementById('new_model_input').value;
    modelHeaderName.innerText = currentGeneratingModel;
    modelToSave.name = currentGeneratingModel;
    intensityArray.innerText = '';

    if (intensitySelect.value === "0") {
        fillArray(bimodalIntensity, intensityArray)
    } else {
        fillArray(unimodalIntensity, intensityArray)
    }
});

document.getElementById('intensity-select').addEventListener("change", () => {
    let intensityArray = document.getElementById('intensity-array');
    intensityArray.innerText = '';
    if (document.getElementById('intensity-select').value === "0") {
        fillArray(bimodalIntensity, intensityArray);
        modelToSave.intensityName = 'Бимодальный'
    } else {
        fillArray(unimodalIntensity, intensityArray);
        modelToSave.intensityName = 'Унимодальный'
    }
});

document.getElementById('model-modal-footer-cancel').addEventListener("click", (ev => {
    document.getElementById('model-modal-outer').style.display = 'none';
}));

document.getElementById('model-modal-footer-cancel').addEventListener("click", (ev => {
    document.getElementById('modal-edge-edit-footer-cancel').style.display = 'none';
}));

//

document.getElementById('modal-edge-edit-footer-confirm').addEventListener("click", ev => {
    document.getElementById('modal-edge-edit-outer').style.display = 'none';
    let edge = $.grep(g.edges, function (item) {
        return (item.isActiveEdit === true)
    });
    edge = edge[0];
    edge.class = document.getElementById('edge-new-parameters-quality').value;
    edge.quality = document.getElementById('edge-new-parameters-quality-quality').value;
    edge.pavementType = document.getElementById('edge-new-parameters-quality-pavement').value;
    edge.bandwidth = qualityTypes[edge.quality].coef;
    edge.accidentCoefficientNerf = 1;
    edge.hasAccidents.forEach((value, index) => {
        if (value.has === 1) {
            edge.accidentCoefficientNerf = edge.accidentCoefficientNerf * roadAccidents[index].bandwidthCoefNerf;
            console.log(value.name)
        }
    });
    edge.fullLength = qualityTypes[edge.quality].coef * roadClasses[edge.class].laneNumber * edge.distance * 1000 * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;
    edge.reductionFactor = qualityTypes[edge.quality].coef * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;
    let edgeDataFullLength = [];
    let edgeLabels = [];
    edge.drawing.forEach((val, k) => {
        edgeLabels.push(val[k].time + ':00');
        edgeDataFullLength.push(edge.fullLength);
    });
    drawEdgeRadarChart(edgeLabels, edgeDataFullLength, edgeRadarChart);
    edge.isActiveEdit = false;
    showNotification('Изменения сохранены')
});

document.getElementById('modal-edge-edit-footer-cancel').addEventListener("click", ev => {
    document.getElementById('modal-edge-edit-outer').style.display = 'none';
    let edge = $.grep(g.edges, function (item) {
        return (item.isActiveEdit === true)
    });
    edge = edge[0];
    edge.isActiveEdit = false;
});

document.getElementById('modal-edge-footer-cancel').addEventListener("click", (ev => {
    document.getElementById('modal-edge-info-outer').style.display = 'none';
    let edge = $.grep(g.edges, function (item) {
        return (item.isActive === true)
    });
    edge = edge[0];
    edge.isActive = false;
    clearInterval(edgeRefreshInterval);
}));


document.getElementById('model-modal-footer-confirm').addEventListener("click", ev => {
    console.log(modelToSave);
    document.getElementById('model-modal-outer').style.display = 'none';
    document.getElementById('model-modal-settings').style.display = 'none';
    saveModel()
});

document.getElementById('check-edit').addEventListener("change", ev => {
    isEditable = !isEditable;
});

document.getElementById('source-nodes').addEventListener("change", ev => {
    let snVal = document.getElementById('source-nodes');
    let tnVal = document.getElementById('target-nodes');
    let neededNode = $.grep(g.edges, function (item) {
        return ((snVal.value === item.source && tnVal.value === item.target) || (snVal.value === item.target && tnVal.value === item.source));
    });
    neededNode = neededNode[0];
    if (snVal.value === tnVal.value || neededNode) {
        document.getElementById('addEdge').setAttribute('disabled', 'disabled');
    } else {
        document.getElementById('addEdge').removeAttribute('disabled');
    }
});

document.getElementById('target-nodes').addEventListener("change", ev => {
    let snVal = document.getElementById('source-nodes');
    let tnVal = document.getElementById('target-nodes');
    let neededNode = $.grep(g.edges, function (item) {
        return ((snVal.value === item.source && tnVal.value === item.target) || (snVal.value === item.target && tnVal.value === item.source));
    });
    neededNode = neededNode[0];
    if (snVal.value === tnVal.value || neededNode) {
        document.getElementById('addEdge').setAttribute('disabled', 'disabled');
    } else {
        document.getElementById('addEdge').removeAttribute('disabled');
    }
});


function fillArray(array, intensityArray) {
    let graphsLabels = [];
    let graphsData = [];

    modelToSave.intensity = array;

    array.forEach((v, k) => {
        let div = document.createElement('div');
        let label = document.createElement('label');
        let span = document.createElement('span');
        let b = document.createElement('b');
        let input = document.createElement('input');

        graphsLabels.push(v[k].time);
        graphsData.push(v[k].coef);

        span.innerText = 'Время суток: ';
        b.innerText = v[k].time;

        input.value = v[k].coef;
        input.classList = 'intensity-item-input';
        input.type = 'text';
        input.addEventListener('change', (ev) => {
            v[k].coef = input.value;
            if (input.value > 0.99) {
                input.value = 0.99;
                v[k].coef = input.value;
            } else if (input.value < 0.01) {
                input.value = 0.01;
                v[k].coef = input.value;
            }
            updateChart(k, input.value, myChart);
            modelToSave.intensity = array;
        });

        input.addEventListener("keyup", (ev => {
            v[k].coef = input.value;
        }));

        div.classList = 'intensity-item';

        label.appendChild(span);
        label.appendChild(b);
        label.appendChild(input);
        div.appendChild(label);
        intensityArray.appendChild(div)
    });
    drawChart(graphsLabels, graphsData, myChart)
}

function appendModel() {
    let model = document.createElement('div');
    let model_name = document.createElement('span');
    let hr = document.createElement('hr');
    let a = document.createElement('a');
    let model_parameters = document.createElement('ul');
    let button = document.createElement('button');
    let modelsEl = document.getElementById('models');

    let liNames = ['Вершин: ', 'Рёбер: ', 'Маршрутов: ', 'Режим: '];

    let tempArrGraph = [];

    let tempGraph = g;
    tempArrGraph.push(tempGraph.nodes.length, tempGraph.edges.length, tempGraph.directions.length, modelToSave.intensityName);


    model.classList = 'model_to_chose';
    model.setAttribute('data-model-name', modelToSave.name);

    model_name.classList = 'model_name';
    model_name.innerText = modelToSave.name;

    a.innerText = ' ×';
    // a.setAttribute('data-model', child.key);
    a.classList = 'delete_link';
    a.addEventListener("click", (e) => {
        // modelsEl.removeChild(model);
        confirm_modal_footer_confirm.setAttribute('data-model', modelToSave.name);
        document.getElementById('modal_outer').style.display = 'flex'
    });

    model_parameters.classList = 'model_parameters';

    button.innerText = 'Выбрать';
    button.addEventListener("click", (e) => {
        currentGeneratingModel = modelToSave.name;
        console.log(currentGeneratingModel + ' выбрана');
        document.getElementById('hello').style.display = 'none';
        document.getElementById('map-container').style.visibility = 'visible';
        document.getElementById('graph-container').style.visibility = 'visible';
        document.getElementById('main-container').style.visibility = 'visible';

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

    document.getElementById('new_model_input').value = ''
}

document.getElementById('all-stat-footer-cancel').addEventListener("click", ev => {
    document.getElementById('all-stat-outer').style.display = 'none';
    document.getElementById('nav-toggle').checked = false;
    document.getElementById('map-container').style.visibility = 'visible';
    document.getElementById('graph-container').style.visibility = 'visible';
    clearInterval(canvasArrayInterval);
});

document.getElementById('start-app-btn').addEventListener("click", ev => {
    let statBody = document.getElementById('all-stat-body');

    if (!wasFilled) {
        wasFilled = true;
        g.edges.forEach((value, index) => {
            let innerDiv = document.createElement('div');
            let innerCanvas = document.createElement('canvas');

            innerDiv.classList = 'all-stat-item';
            innerDiv.id = 'stat-item-id-' + value.id;
            innerCanvas.style.width = '100%';
            innerCanvas.style.height = '100%';
            innerCanvas.id = 'canvas-item-id-' + value.id;
            innerDiv.appendChild(innerCanvas);
            statBody.appendChild(innerDiv);

            canvasArray[index] = new Chart(document.getElementById(innerCanvas.id), {
                type: 'line',
                data: {
                    labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
                    datasets: [{
                        label: 'Статистика ребра ' + value.id,
                        data: null,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        });
    }

    let canvasArrayInterval = setInterval(() => {
        canvasArray.forEach((value, index) => {
            value.data.datasets[0].data[hours] = g.edges[index].drawing[hours][hours].carsAmount;
            value.update()
        })
    }, 5000);
});

document.getElementById('show-all-stat-btn').addEventListener("click", ev => {
    document.getElementById('all-stat-outer').style.display = 'block';
    document.getElementById('nav-toggle').checked = false;
    document.getElementById('map-container').style.visibility = 'hidden';
    document.getElementById('graph-container').style.visibility = 'hidden';
});


document.getElementById('generate-directions').addEventListener("click", ev => {
    showNotification('Генерация маршрутов была начата');
    document.getElementById('generate-directions').setAttribute('disabled', 'disabled');
    // document.getElementById('generate-directions-outer').style.display = 'flex';
    // document.getElementById('map-container').style.visibility = 'hidden';
    // document.getElementById('graph-container').style.visibility = 'hidden';
    // document.getElementById('main-container').style.visibility = 'hidden';
    g.directions = [];
    generateDirections();
});

document.getElementById('time-input').addEventListener("change", ev => {
    let time = document.getElementById('time-input').value;
    time = time.split(':')[0];
    if (Number(time[0])) {
        hours = Number(time);
    } else {
        hours = Number(time[1])
    }
    console.log(hours)
});

function changeEdgeClass(edgeNewParametersQuality) {

    let edgeNewParametersAll = document.getElementById('edge-new-parameters-all');
    edgeNewParametersAll.innerHTML = "";
    document.getElementById('edge-new-parameters-quality-description').innerText = roadClasses[edgeNewParametersQuality].description;


    let p1 = document.createElement('p');
    let p2 = document.createElement('p');
    let p3 = document.createElement('p');

    let span1 = document.createElement('span');
    let span2 = document.createElement('span');
    let span3 = document.createElement('span');

    let b1 = document.createElement('b');
    let b2 = document.createElement('b');
    let b3 = document.createElement('b');

    b1.innerText = roadClasses[edgeNewParametersQuality].laneNumber;
    b2.innerText = roadClasses[edgeNewParametersQuality].minSpeed + ' км/ч';
    b3.innerText = roadClasses[edgeNewParametersQuality].maxSpeed + ' км/ч';

    span1.innerText = 'Количество полос движения: ';
    span2.innerText = 'Минимальная скорость движения автомобилей: ';
    span3.innerText = 'Максимальная скорость движения автомобилей: ';

    span1.appendChild(b1);
    span2.appendChild(b2);
    span3.appendChild(b3);

    p1.appendChild(span1);
    p2.appendChild(span2);
    p3.appendChild(span3);

    edgeNewParametersAll.append(p1, p2, p3);
}

document.getElementById('edge-new-parameters-quality').addEventListener("change", ev => {
    let edgeNewParametersQuality = document.getElementById('edge-new-parameters-quality').value;
    changeEdgeClass(edgeNewParametersQuality);
});

document.getElementById('edge-new-parameters-quality-pavement').addEventListener("change", ev => {
    let edge = $.grep(g.edges, function (item) {
        return (item.isActiveEdit === true)
    });
    edge = edge[0];
    edge.class = document.getElementById('edge-new-parameters-quality').value;
    edge.quality = document.getElementById('edge-new-parameters-quality-quality').value;
    edge.pavementType = document.getElementById('edge-new-parameters-quality-pavement').value;
    edge.bandwidth = qualityTypes[edge.quality].coef;
    edge.accidentCoefficientNerf = 1;
    edge.hasAccidents.forEach((value, index) => {
        if (value.has === 1) {
            edge.accidentCoefficientNerf = edge.accidentCoefficientNerf * roadAccidents[index].bandwidthCoefNerf;
        }
    });
    edge.fullLength = qualityTypes[edge.quality].coef * roadClasses[edge.class].laneNumber * edge.distance * 1000 * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;
    edge.reductionFactor = qualityTypes[edge.quality].coef * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;
    console.log(qualityTypes[edge.quality].coef, pavementTypes[edge.pavementType].coef, edge.reductionFactor, edge.accidentCoefficientNerf);
    sayVerdict(edge.reductionFactor)
});

document.getElementById('edge-new-parameters-quality-quality').addEventListener("change", ev => {
    let edge = $.grep(g.edges, function (item) {
        return (item.isActiveEdit === true)
    });
    edge = edge[0];
    edge.class = document.getElementById('edge-new-parameters-quality').value;
    edge.quality = document.getElementById('edge-new-parameters-quality-quality').value;
    edge.pavementType = document.getElementById('edge-new-parameters-quality-pavement').value;
    edge.bandwidth = qualityTypes[edge.quality].coef;
    edge.accidentCoefficientNerf = 1;
    edge.hasAccidents.forEach((value, index) => {
        if (value.has === 1) {
            edge.accidentCoefficientNerf = edge.accidentCoefficientNerf * roadAccidents[index].bandwidthCoefNerf;
            console.log(value.name)
        }
    });
    edge.fullLength = qualityTypes[edge.quality].coef * roadClasses[edge.class].laneNumber * edge.distance * 1000 * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;
    edge.reductionFactor = qualityTypes[edge.quality].coef * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;
    console.log(qualityTypes[edge.quality].coef, pavementTypes[edge.pavementType].coef, edge.reductionFactor, edge.accidentCoefficientNerf);
    sayVerdict(edge.reductionFactor)
});

function sayVerdict(coef) {
    let p = document.getElementById('edge-reduction-factor-verdict');
    let code = document.createElement('code');
    let b = document.createElement('b');

    if (coef !== 1) {
        coef = ((1 - coef) * 100).toFixed(1);
        b.innerText = coef + '%';
        code.appendChild(b);
        code.style.color = 'red';
        p.innerText = 'Выбранные вами параметры ребра уменьшает его пропускную способность на ';
        p.appendChild(code);
    } else {
        let p1 = document.createElement('p');
        b.style.color = 'green';
        p.innerText = 'Выбранные вами параметры ребра ';
        b.innerText = 'не уменьшат';
        p1.innerText += ' пропускную способность ребра';
        code.appendChild(b);
        p.append(code, p1);
        //

    }
}