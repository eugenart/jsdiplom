function saveModel() {
    let modelName = $('#saveName').val();
    let myObject = new Object()
    myObject.name = modelName
    myObject.g = g
    console.log(myObject.g)
    if (localStorage) {
        if (localStorage.names) {
            modelNames = localStorage.names
            modelNames = JSON.parse(modelNames)
            if (modelNames.includes(modelName)) {
                console.log('yes')
            } else {
                console.log(modelNames)
                modelNames.push(modelName)
                localStorage.names = JSON.stringify(modelNames)
            }
        } else {
            modelNames.push(modelName)
            localStorage.names = JSON.stringify(modelNames)
        }
        localStorage[modelName] = {}
        localStorage[modelName] = JSON.stringify(myObject)
    }
}

function loadModel() {
    if (localStorage) {
        let currentModel = JSON.parse(localStorage[$('#seletModel').val()]);
        $('#saveName').val(currentModel.name);
        g = currentModel.g;
        $.each(g.nodes, function (k, v) {
            let newNode = v
            console.log()
            nodesNumber += 1;
            sigmaInstance.graph.addNode(newNode);
            $('#source-nodes, #target-nodes').append(new Option(newNode.label, newNode.id));
            $('#start-nodes, #finish-nodes').append(new Option(newNode.label, newNode.id));
            $('.tnodes tbody').append($('<tr>')
                .append($('<td>')
                    .append(newNode.id)
                )
                .append($('<td>')
                    .append(newNode.label)
                )
            )
            leafletPlugin.syncNodes((newNode.id).toString());
            // Fit the view to the graph
            leafletPlugin.fitBounds();
        })

        $.each(g.edges, function (k, v) {
            let newEdge = v
            sigmaInstance.graph.addEdge(newEdge);
            span = $('<span id="carsOnEdge_' + newEdge.id + '">0</span>')
            $('.tedges tbody').append($('<tr>', {
                    'data-trEdgeSource': newEdge.source,
                    'data-trEdgeTarget': newEdge.target
                })
                    .append($('<td>')
                        .append(newEdge.id)
                    )
                    .append($('<td>')
                        .append(newEdge.source)
                    )
                    .append($('<td>')
                        .append(newEdge.target)
                    )
                    .append($('<td>')
                        .append(newEdge.distance.toFixed(3))
                    )
                    .append($('<td>')
                        .append(newEdge.bandwidth)
                    )
                    .append($('<td>')
                        .append(span)
                    )
            )
            leafletPlugin.fitBounds();
        })

        $.each(g.directions, function (k, v) {
            let newDirection = v
            span = $('<span id="carsOnRoute_' + newDirection.id + '">0</span>');
            button = $('<button id="routeId_' + newDirection.id + '">Go</button>');
            button.click(function () {
                addCars(newDirection.id)
            })
            $('.tdirections tbody').append($('<tr>', {
                'data-trDirectionStart': newDirection.start,
                'data-trDirectionFinish': newDirection.finish
            })
                .append($('<td>')
                    .append(newDirection.id)
                )
                .append($('<td>')
                    .append(newDirection.start)
                )
                .append($('<td>')
                    .append(newDirection.finish)
                )
                .append($('<td>')
                    .append(newDirection.distance.toFixed(3))
                )
                .append($('<td>')
                    .append(span)
                ))
                .append($('<tr>')
                    .append($('<td>', {
                        colspan: 4
                    })
                        .append(newDirection.formatedRoute))
                    .append($('<td>')
                        .append(button))
                )
        })

    }
}