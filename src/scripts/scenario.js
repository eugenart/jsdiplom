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

                edge.speedCoefficientNerf = edge.speedCoefficientNerf * val.speedCoefNerf;
                edge.speedReductionFactor = qualityTypes[edge.quality].speedCoef * pavementTypes[edge.pavementType].speedCoef * edge.speedCoefficientNerf;

                edge.accidentCoefficientNerf = edge.accidentCoefficientNerf * val.bandwidthCoefNerf;
                edge.reductionFactor = qualityTypes[edge.quality].coef * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;

                edge.fullLength = qualityTypes[edge.quality].coef * roadClasses[edge.class].laneNumber * edge.distance * 1000 * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;
                edge.bandwidth = qualityTypes[edge.quality].coef * edge.speedCoefficientNerf;

            } else {
                edge.hasAccidents[index].has = 0;
                edge.points = 0;
                // edge.bandwidth = qualityTypes[edge.quality].coef / edge.speedCoefficientNerf;
                // edge.speedCoefficientNerf = edge.speedCoefficientNerf / val.speedCoefNerf;
                edge.speedCoefficientNerf = edge.speedCoefficientNerf / val.speedCoefNerf;
                edge.accidentCoefficientNerf = edge.accidentCoefficientNerf / val.bandwidthCoefNerf;

                edge.reductionFactor = qualityTypes[edge.quality].coef * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;
                edge.fullLength = qualityTypes[edge.quality].coef * roadClasses[edge.class].laneNumber * edge.distance * 1000 * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;

                edge.speedReductionFactor = qualityTypes[edge.quality].speedCoef * pavementTypes[edge.pavementType].speedCoef * edge.speedCoefficientNerf;
                edge.bandwidth = qualityTypes[edge.quality].coef * edge.speedCoefficientNerf;
            }
            console.log(edge.bandwidth, edge.speedReductionFactor);
            sayVerdict(edge.reductionFactor, edge.speedReductionFactor);
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
    let edgeDataHoursMaxLoad = [];
    edge.drawing.forEach((val, k) => {
        edgeLabels.push(val[k].time + ':00');
        edgeDataFullLength.push(edge.fullLength);
        edgeDataHoursMaxLoad.push(val[k].maxLoad);
    });
    drawEdgeRadarChart(edgeLabels, edgeDataFullLength, edgeDataHoursMaxLoad, edgeRadarChart);
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

document.getElementById('recommendations-cancel').addEventListener("click", ev => {
    document.getElementById('recommendations-outer').style.display = 'none';
    document.getElementById('nav-toggle').checked = false;
    document.getElementById('map-container').style.visibility = 'visible';
    document.getElementById('graph-container').style.visibility = 'visible';
});


document.getElementById('start-app-btn').addEventListener("click", ev => {
    let statBody = document.getElementById('all-stat-body');
    document.getElementById('stat-widget').style.display = 'block';
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

document.getElementById('show-recommendations').addEventListener("click", ev => {
    document.getElementById('recommendations-outer').style.display = 'block';
    document.getElementById('nav-toggle').checked = false;
    document.getElementById('map-container').style.visibility = 'hidden';
    document.getElementById('graph-container').style.visibility = 'hidden';

    let container = document.getElementById('edges-with-points');
    container.innerHTML = '';
    let i = 1;
    g.edges.forEach((value, index) => {
        let changeRoute = true;
        if (value.points > 1) {
            let p = document.createElement('p');
            p.style.color = '#041e42';
            p.style.fontWeight = 'bold';
            p.style.margin = '0';
            p.innerText = i + ') Возможные пути увеличения пропускной способности ребра ' + value.id;
            container.appendChild(p);
            let ul = document.createElement('ul');
            if (changeRoute) {
                if (value.quality !== "0") {
                    let li = document.createElement('li');
                    li.innerText = `Улучшить качество дороги до состояния "${qualityTypes[value.quality - 1].name}"`
                    ul.appendChild(li)
                    changeRoute = false;
                }
                if (value.pavementType !== "0") {
                    let li = document.createElement('li');
                    li.innerText = `Улучшить тип дорожного покрытия на "${pavementTypes[value.quality - 1].name}"`
                    ul.appendChild(li)
                    changeRoute = false;
                }
                value.hasAccidents.forEach((v, k) => {
                    if (v.has) {
                        let li = document.createElement('li');
                        li.innerText = `Устранить дорожную ситуацию "${v.name}"`
                        ul.appendChild(li)
                        changeRoute = false;
                    }
                })
                if (value.class !== '0') {
                    let li = document.createElement('li');
                    li.innerText = `Увеличить количество полос до "${roadClasses[value.class - 1].laneNumber}"`
                    let li2 = document.createElement('li');
                    li2.innerText = `Улучшить класс дороги до "${roadClasses[value.class - 1].name}"`
                    ul.appendChild(li)
                    ul.appendChild(li2)
                    changeRoute = false;
                }
            }
            if (changeRoute) {
                let li = document.createElement('li');
                li.innerText = `Добавьте альтернативные маршруты движения автомобилей между выбранными точками (${value.source}, ${value.target})`
                ul.appendChild(li)
            }
            ++i;
            container.appendChild(ul)
        }
    });
});


document.getElementById('generate-directions').addEventListener("click", ev => {
    showNotification('Генерация маршрутов была начата');
    document.getElementById('generate-directions').setAttribute('disabled', 'disabled');
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
    let edge = $.grep(g.edges, function (item) {
        return (item.isActiveEdit === true)
    });
    edge = edge[0];

    edge.points = 0;

    console.log(edge.class);
    changeEdgeClass(edgeNewParametersQuality);
    edge.class = edgeNewParametersQuality;
    edge.size = roadClasses[edge.class].laneNumber;
    console.log(edge.class);
    sigmaInstance.refresh();
});

document.getElementById('edge-new-parameters-quality-pavement').addEventListener("change", ev => {
    let edge = $.grep(g.edges, function (item) {
        return (item.isActiveEdit === true)
    });
    edge = edge[0];
    edge.class = document.getElementById('edge-new-parameters-quality').value;
    edge.quality = document.getElementById('edge-new-parameters-quality-quality').value;
    edge.pavementType = document.getElementById('edge-new-parameters-quality-pavement').value;

    edge.points = 0;

    edge.accidentCoefficientNerf = 1;
    edge.hasAccidents.forEach((value, index) => {
        if (value.has === 1) {
            edge.accidentCoefficientNerf = edge.accidentCoefficientNerf * roadAccidents[index].bandwidthCoefNerf;
            edge.speedCoefficientNerf = edge.speedCoefficientNerf * roadAccidents[index].speedCoefNerf;
        }
    });
    edge.bandwidth = qualityTypes[edge.quality].coef * edge.speedCoefficientNerf;
    edge.speedReductionFactor = qualityTypes[edge.quality].speedCoef * pavementTypes[edge.pavementType].speedCoef * edge.speedCoefficientNerf;

    edge.fullLength = qualityTypes[edge.quality].coef * roadClasses[edge.class].laneNumber * edge.distance * 1000 * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;
    edge.reductionFactor = qualityTypes[edge.quality].coef * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;

    console.log(edge.bandwidth, edge.speedReductionFactor);
    sayVerdict(edge.reductionFactor, edge.speedReductionFactor)
});

//     console.log(edge.bandwidth, edge.speedCoefficientNerf);

document.getElementById('edge-new-parameters-quality-quality').addEventListener("change", ev => {
    let edge = $.grep(g.edges, function (item) {
        return (item.isActiveEdit === true)
    });
    edge = edge[0];
    edge.class = document.getElementById('edge-new-parameters-quality').value;
    edge.quality = document.getElementById('edge-new-parameters-quality-quality').value;
    edge.pavementType = document.getElementById('edge-new-parameters-quality-pavement').value;

    edge.points = 0;

    edge.accidentCoefficientNerf = 1;
    edge.hasAccidents.forEach((value, index) => {
        if (value.has === 1) {
            edge.accidentCoefficientNerf = edge.accidentCoefficientNerf * roadAccidents[index].bandwidthCoefNerf;
            edge.speedCoefficientNerf = edge.speedCoefficientNerf * roadAccidents[index].speedCoefNerf;
            console.log(value.name)
        }
    });
    edge.bandwidth = qualityTypes[edge.quality].coef * edge.speedCoefficientNerf;
    edge.speedReductionFactor = qualityTypes[edge.quality].speedCoef * pavementTypes[edge.pavementType].speedCoef * edge.speedCoefficientNerf;

    edge.fullLength = qualityTypes[edge.quality].coef * roadClasses[edge.class].laneNumber * edge.distance * 1000 * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;
    edge.reductionFactor = qualityTypes[edge.quality].coef * pavementTypes[edge.pavementType].coef * edge.accidentCoefficientNerf;

    console.log(edge.bandwidth, edge.speedReductionFactor);
    sayVerdict(edge.reductionFactor, edge.speedReductionFactor);
    sigmaInstance.refresh();
});

function sayVerdict(coef, speedCoef) {
    let p = document.getElementById('edge-reduction-factor-verdict');
    let code = document.createElement('code');
    let codeSpeed = document.createElement('code');
    let b = document.createElement('b');
    let bSpeed = document.createElement('b');

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
    if (speedCoef !== 1) {
        let span = document.createElement('span');
        let span2 = document.createElement('span');
        let p2 = document.createElement('p');
        span.style.fontSize = '16px';
        span2.style.fontSize = '16px';
        span.innerText = ' и уменьшат на ';
        bSpeed.style.color = 'red';
        bSpeed.innerText = ((1 - speedCoef) * 100).toFixed(1) + '% ';
        codeSpeed.appendChild(bSpeed);
        span2.innerText += ' скорость автомобилей на нём';
        p2.append(span, codeSpeed, span2);
        p.appendChild(p2)
    } else {
        let span = document.createElement('span');
        let span2 = document.createElement('span');
        let p2 = document.createElement('p');
        span.style.fontSize = '16px';
        span2.style.fontSize = '16px';
        span.innerText = ' и ';
        bSpeed.style.color = 'green';
        bSpeed.innerText = 'не уменьшат ';
        codeSpeed.appendChild(bSpeed);
        span2.innerText += ' скорость автомобилей на нём';
        p2.append(span, codeSpeed, span2);
        p.appendChild(p2)
    }
}

widget = document.getElementById('stat-widget');
widget.onmousedown = (e) => {
    var coords = getCoords(widget);
    var shiftX = e.pageX - coords.left;
    var shiftY = e.pageY - coords.top;

    widget.style.position = 'absolute';
    document.body.appendChild(widget);
    moveAt(e);

    widget.style.zIndex = 999999;

    function moveAt(e) {
        widget.style.left = e.pageX - shiftX + 'px';
        widget.style.top = e.pageY - shiftY + 'px';
    }

    document.onmousemove = function (e) {
        moveAt(e);
    };

    widget.onmouseup = function () {
        document.onmousemove = null;
        widget.onmouseup = null;
    };

}

widget.ondragstart = function () {
    return false;
};

function getCoords(elem) {   // кроме IE8-
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

var tabs = (function () {
    return function (selector, config) {
        var
            _tabsContainer = (typeof selector === 'string' ? document.querySelector(selector) : selector);

        var _showTab = function (tabsLinkTarget) {
            var tabsPaneTarget, tabsLinkActive, tabsPaneShow;
            tabsPaneTarget = document.querySelector(tabsLinkTarget.getAttribute('href'));
            tabsLinkActive = tabsLinkTarget.parentElement.querySelector('.tabs__link_active');
            tabsPaneShow = tabsPaneTarget.parentElement.querySelector('.tabs__pane_show');
            // если следующая вкладка равна активной, то завершаем работу
            if (tabsLinkTarget === tabsLinkActive) {
                return;
            }
            // удаляем классы у текущих активных элементов
            if (tabsLinkActive !== null) {
                tabsLinkActive.classList.remove('tabs__link_active');
            }
            if (tabsPaneShow !== null) {
                tabsPaneShow.classList.remove('tabs__pane_show');
            }
            // добавляем классы к элементам (в завимости от выбранной вкладки)
            tabsLinkTarget.classList.add('tabs__link_active');
            tabsPaneTarget.classList.add('tabs__pane_show');
            var eventTabShow = new CustomEvent('tab.show', {bubbles: true, detail: {tabsLinkPrevious: tabsLinkActive}});
            tabsLinkTarget.dispatchEvent(eventTabShow);
        }

        var _switchTabTo = function (tabsLinkIndex) {
            var tabsLinks = _tabsContainer.querySelectorAll('.tabs__link');
            if (tabsLinks.length > 0) {
                if (tabsLinkIndex > tabsLinks.length) {
                    tabsLinkIndex = tabsLinks.length;
                } else if (tabsLinkIndex < 1) {
                    tabsLinkIndex = 1;
                }
                _showTab(tabsLinks[tabsLinkIndex - 1]);
            }
        }

        var _setupListeners = function () {
            _tabsContainer.addEventListener('click', function (e) {
                var tabsLinkTarget = e.target;
                // завершаем выполнение функции, если кликнули не по ссылке
                if (!tabsLinkTarget.classList.contains('tabs__link')) {
                    return;
                }
                // отменяем стандартное действие
                e.preventDefault();
                _showTab(tabsLinkTarget);
            });
        }

        _setupListeners();

        return {
            switchTabTo: function (index) {
                _switchTabTo(index);
            }
        }
    }
}());

tabs('.tabs');