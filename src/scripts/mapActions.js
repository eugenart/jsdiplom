map.on('click', function (e) {
    if (isEditable) {
        let newNode = {
            id: 'n' + nodesNumber,
            label: 'node' + nodesNumber,
            x: Math.random(),
            y: Math.random(),
            lat: e.latlng.lat, // mandatory field
            lng: e.latlng.lng, // mandatory field
            size: 100,
            color: '#000'
        };

        nodesNumber += 1;
        sigmaInstance.graph.addNode(newNode);
        $('#source-nodes, #target-nodes').append(new Option(newNode.label, newNode.id));
        $('#start-nodes, #finish-nodes').append(new Option(newNode.label, newNode.id));
        a = $('<a class="node-link" href="#" data-node="' + newNode.id + '">X</a>');
        a.click(function () {
            g.edges = $.grep(g.edges, (function (elem) {
                if (elem.target === newNode.id || elem.source === newNode.id) {
                    $('.tedges').find('tr[data-trEdgeTarget="' + newNode.id + '"]').remove()
                    $('.tedges').find('tr[data-trEdgeSource="' + newNode.id + '"]').remove()
                    return false
                } else {
                    return true
                }
            }));

            let nodeValue = $(this).data('node');

            g.nodes = $.grep(g.nodes, function (item) {
                return (nodeValue !== item.id)
            })

            g.edges = $.grep(g.edges, function (item, i) {
                return (nodeValue !== item.id)
            })

            sigmaInstance.graph.dropNode($(this).data('node'));
            leafletPlugin.syncNodes();
            $(this).closest('tr').remove();
            resetSelects();
        });
        $('.tnodes tbody').append($('<tr>')
            .append($('<td>')
                .append(newNode.id)
            )
            .append($('<td>')
                .append(newNode.label)
            )
            .append($('<td>')
                .append(a)
            )
        )
        g.nodes.push(newNode);
        leafletPlugin.syncNodes((newNode.id).toString());
        // Fit the view to the graph
        leafletPlugin.fitBounds();
    }
});

$('#addEdge').submit(function (e) {
    e.preventDefault();
    sNode = g.nodes.find(item => item.id === $('#source-nodes').val())
    tNode = g.nodes.find(item => item.id === $('#target-nodes').val())
    distance = distanceInKmBetweenEarthCoordinates(sNode.lat, sNode.lng, tNode.lat, tNode.lng)
    let newEdge = {
        id: 'e' + g.edges.length,
        source: sNode.id,
        target: tNode.id,
        distance: distance,
        color: 'black',
        bandwidth: Math.floor(Math.random() * (5 - 1 + 1)) + 1,
        cars: 0
    };
    sigmaInstance.graph.addEdge(newEdge);
    g.edges.push(newEdge);
    // a = $('<a class="edge-link" href="#" data-edge="' + newEdge.id + '">X</a>');
    span = $('<span id="carsOnEdge_' + newEdge.id + '">0</span>')
    // a.click(function () {
    //     let edgeValue = $(this).data('edge')
    //     g.edges = $.grep(g.edges, function (item) {
    //         return (edgeValue != item.id)
    //     })
    //     sigmaInstance.graph.dropEdge(edgeValue);
    //     leafletPlugin.syncNodes();
    //     $(this).closest('tr').remove();
    // });
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
                .append(span)
            )
            .append($('<td>')
                .append(newEdge.bandwidth)
            )
    )
    leafletPlugin.fitBounds();
});
