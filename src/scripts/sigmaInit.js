var sigmaInstance,
        modelNames = [],
        g = {
            nodes: [],
            edges: [],
            directions: []
        };

    // mandatory if we use the dragNodes plugin:
    sigma.renderers.def = sigma.renderers.canvas;

    isEditable = false

    // Instantiate sigma
    sigmaInstance = new sigma({
        graph: g,
        container: 'graph-container',
        settings: {
            
            // style the nodes to spot them easily:
            nodeBorderSize: 1,
            defaultNodeBorderColor: '#fff',
            nodeOuterBorderSize: 2,
            minNodeSize: 1,
            maxNodeSize: 10,
            minEdgeSize: 1,
            maxEdgeSize: 5,
            autoRescale: false
        }
    });


    // Stamen.TonerLite layer
    var Stamen_TonerLite = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
        detectRetina: true
    });

    var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        detectRetina: true,
        maxZoom: 16
    });


    // Instantiate Leaflet
    var map = L.map('map-container', {
        layers: [Esri_WorldGrayCanvas],
        // avoid unexpected moves:
        scrollWheelZoom: 'center',
        doubleClickZoom: 'center',
        bounceAtZoomLimits: false,
        keyboard: false
    }).setView([54.187, 45.182], 18); // Init view centered on Paris

    // Instantiate Sigma plugin for Leaflet with optional animation settings
    var leafletPlugin = sigma.plugins.leaflet(sigmaInstance, map, {
        easing: 'cubicInOut',
        duration: 800
    });

    // Initialize the dragNodes plugin:
    var dragListener = sigma.plugins.dragNodes(sigmaInstance, sigmaInstance.renderers[0]);

    // The geographical coordinates of the dragged nodes will be updated
    // to their new location to preserve their position during zoom.
    leafletPlugin.bindDragListener(dragListener);

    // Initialize the filter plugin:
    var filter = sigma.plugins.filter(sigmaInstance);

    // Use a filter to hide nodes with no geo coordinates
    leafletPlugin.bindFilter(filter);

    leafletPlugin.enable();