var cleanweb_map = cleanweb_map || (function () {

    var init = function(){
        var zoom=14;


        var stationServiceUrl = 'http://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=DEMO_KEY&location=Boston+MA&fuel_type=ELEC';
        var items = [];
//        var data = {};
        $.getJSON(stationServiceUrl, function(data) {
            alert(data);
            $.each(data, function(key) {
                items.push(key);
            });
        });

        map = new OpenLayers.Map("mapdiv", {
            displayProjection: new OpenLayers.Projection("EPSG:4326")
        });
        
        map.addLayer(new OpenLayers.Layer.OSM({
            isBaseLayer: true,
            sphericalMercator:true
        }));
        
        var lonLat = new OpenLayers.LonLat( -71.0603, 42.3583 )
            .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            map.getProjectionObject() // to Spherical Mercator Projection
        );

//        var wms_projection = new OpenLayers.Projection("EPSG:4326");
//        var google_projection = new OpenLayers.Projection("EPSG:900913");

        var markers = new OpenLayers.Layer.Markers( "Markers" );
        map.addLayer(markers);
        markers.addMarker(new OpenLayers.Marker(lonLat));

//        var windTurbines =  new OpenLayers.Geometry.Point("KML", {
//            projection: map.displayProjection,
//            strategies: [new OpenLayers.Strategy.Fixed()],
//            protocol: new OpenLayers.Protocol.HTTP({
//                url: "kml_data/NREL_MA_50m_Wind_Resource.kml",
//                format: new OpenLayers.Format.KML({
//                    extractStyles: true,
//                    extractAttributes: true
//                })
//            })
//        });
//
//        map.addLayer(windTurbines);

        var bikeTrails =  new OpenLayers.Layer.Vector("KML", {
            projection: map.displayProjection,
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                url: "kml_data/bikeTrails.kml",
                format: new OpenLayers.Format.KML({
                    extractStyles: true,
                    extractAttributes: true
                })
            })
        });

        map.addLayer(bikeTrails);

        //var select = new OpenLayers.Control.SelectFeature(bikeTrails);

        //bikeTrails.events.on({
        //    "featureselected": onFeatureSelect,
        //    "featureunselected": onFeatureUnselect
        //});

        //map.addControl(select);
        //select.activate();

        json_layer = new OpenLayers.Layer.Vector("JSON", {
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                url: "http://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=DEMO_KEY&location=Boston+MA&fuel_type=ELEC",
                format: new OpenLayers.Format.JSON()
            })
        });


        map.setCenter (lonLat, zoom);
    };

    //var onPopupClose = function(evt) {
    //    select.unselectAll();
    //};
    //
    //var onFeatureSelect = function(event){
    //    var feature = event.feature;
    //    var selectedFeature = feature;
    //    var popup = new OpenLayers.Popup.FramedCloud("chicken",
    //        feature.geometry.getBounds().getCenterLonLat(),
    //        new OpenLayers.Size(100,100),
    //        "<h2>"+feature.attributes.name + "</h2>" + feature.attributes.description,
    //        null, true, onPopupClose
    //    );
    //    feature.popup = popup;
    //    map.addPopup(popup);
    //};
    //
    //var onFeatureUnselect = function(event){
    //    var feature = event.feature;
    //    if(feature.popup) {
    //        map.removePopup(feature.popup);
    //        feature.popup.destroy();
    //        delete feature.popup;
    //    }
    //};

    return {
        init: init
    }

})();