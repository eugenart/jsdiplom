let myChart = new Chart(document.getElementById('myChart'), {
    type: 'line',
    data: {
        labels: null,
        datasets: [{
            label: 'Суточная интенсивность движения автомобилей',
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

let myChartForModel = new Chart(document.getElementById('simulation-model-draw'), {
    type: 'line',
    data: {
        labels: null,
        datasets: [{
            label: 'Суточная интенсивность движения автомобилей',
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

let modalEdgeCanvas = new Chart(document.getElementById('modal-edge-canvas'), {
    type: 'line',
    data: {
        labels: null,
        datasets: [{
            label: 'Суточная интенсивность движения автомобилей',
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

var barChartForEdge = new Chart(document.getElementById('edge-bar-chart'), {
    type: 'bar',
    data: {
        labels: null,
        datasets: [{
            label: 'Процент времени, когда ребро было перегружено',
            data: null,
            backgroundColor: [
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 100
                }
            }]
        }
    }
});

var edgeRadarChart = new Chart(document.getElementById('modal-edge-load'), {
    type: 'radar',
    data: {
        labels: null,
        datasets: [{
            label: 'Допустимая загруженность',
            data: null,
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1
        }, {
            label: 'Максимальная загруженность',
            data: null,
            backgroundColor: [
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    suggestedMin: 50,
                    suggestedMax: 100
                }
            }]
        }
    }
});

function drawEdgeRadarChart(graphsLabels, edgeDataFullLength, edgeDataHoursMaxLoad, edgeRadarChart) {
    edgeRadarChart.data.labels = graphsLabels;
    edgeRadarChart.data.datasets[0].data = edgeDataFullLength;
    edgeRadarChart.data.datasets[1].data = edgeDataHoursMaxLoad;
    edgeRadarChart.update()
}

function updateEdgeRadarChart(data, hour, edgeRadarChart) {
    edgeRadarChart.data.datasets[1].data[hour] = data;
    edgeRadarChart.update()
}

function drawBarChartForEdge(graphsLabels, graphsData, barChartForEdge) {
    barChartForEdge.data.labels = graphsLabels;
    barChartForEdge.data.datasets[0].data = graphsData;
    barChartForEdge.update()
}

function updateBarChartForEdge(data, hour, modalEdgeCanvas) {
    barChartForEdge.data.datasets[0].data[hour] = data;
    barChartForEdge.update()
}

function drawChartForEdge(graphsLabels, graphsData, modalEdgeCanvas) {
    modalEdgeCanvas.data.labels = graphsLabels;
    modalEdgeCanvas.data.datasets[0].data = graphsData;
    modalEdgeCanvas.update()
}

function updateChartForEdge(data, hour, modalEdgeCanvas) {
    modalEdgeCanvas.data.datasets[0].data[hour] = data;
    modalEdgeCanvas.update()
}

function drawChart(graphsLabels, graphsData, myChart) {
    myChart.data.labels = graphsLabels;
    myChart.data.datasets[0].data = graphsData;
    myChart.update()
}

function drawChartForModel(graphsLabels, graphsData, myChartForModel) {
    myChartForModel.data.labels = graphsLabels;
    myChartForModel.data.datasets[0].data = graphsData;
    myChartForModel.update()
}

function updateChart(k, val, myChart) {
    myChart.data.datasets[0].data[k] = val;
    myChart.update()
}
