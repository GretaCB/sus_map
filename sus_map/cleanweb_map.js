var cleanweb_map = cleanweb_map || (function () {

    var init = function(){
        var zoom=14;
    
        map = new OpenLayers.Map("mapdiv", {
            displayProjection: new OpenLayers.Projection("EPSG:4326")
        });
        

        
        /*
        //OpenStreetMap Base Layer
        */
        map.addLayer(new OpenLayers.Layer.OSM({
            isBaseLayer: true,
            sphericalMercator:true
        }));
        
        map.addControl(new OpenLayers.Control.LayerSwitcher());
        
        // Center of the map
        var lonLat = new OpenLayers.LonLat( -71.0603, 42.3583 )
            .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            map.getProjectionObject() // to Spherical Mercator Projection
        );
        
        /*
        //Farmers Markets Layer
        */
        var farmersMarkets =  new OpenLayers.Layer.Vector("Farmers Markets", {
            projection: map.displayProjection,
            style: {externalGraphic: 'images/fm.gif', graphicWidth: 25, graphicHeight: 25},
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                url: "kml_data/farmers_markets.kml",
                format: new OpenLayers.Format.KML({
                    extractStyles: true,
                    extractAttributes: true
                })
            })
        });

        map.addLayer(farmersMarkets);
        
        /*
        //Bike Trails Layer 
        */
        var bikeTrails =  new OpenLayers.Layer.Vector("Bike Trails", {
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
        
        /*
        //Electric Charging Stations 
        */
        map.addControl(new OpenLayers.Control.LayerSwitcher());
        var proj = new OpenLayers.Projection("EPSG:4326");
        var pointLayer = new OpenLayers.Layer.Vector("Electric Charging Stations", {
            maxExtent: new OpenLayers.Bounds(-200,-200,200,200),
            style: {externalGraphic: 'images/elec.jpg', graphicWidth: 21, graphicHeight: 25}
        });
        map.addLayer(pointLayer);

        var stationServiceUrl = 'http://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=b908359a2bbf6c31c4bb7ba24f5b5e502612c0e3&location=Boston+MA&fuel_type=ELEC';
        $.getJSON(stationServiceUrl,function(json){
            fuel_stations = json.fuel_stations;
            $.each(fuel_stations, function(index, station) {
                //alert("lat:"+station.latitude+",long:"+station.longitude);
                var lonlat = new OpenLayers.LonLat(station.longitude, station.latitude);
                lonlat.transform(proj, map.getProjectionObject());
                map.setCenter(lonlat, zoom);

                var point = new OpenLayers.Geometry.Point(station.longitude, station.latitude);
                point = point.transform(proj, map.getProjectionObject());
                //alert(point);
                var pointFeature = new OpenLayers.Feature.Vector(point, null, null);
                pointLayer.addFeatures([pointFeature]);
            });
        });


        /* 
         */
        // make a kml for the data types that we don't have yet
        // eg. chp plants
      
        var select = new OpenLayers.Control.SelectFeature(farmersMarkets);

        farmersMarkets.events.on({
            "featureselected": onFeatureSelect,
            "featureunselected": onFeatureUnselect
        });

        map.addControl(select);
        select.activate();
    
        
        /* This is the last thing for the map to display centered
        */
        map.setCenter (lonLat, zoom);
    };

    var onPopupClose = function(evt) {
        select.unselectAll();
    };
    
    var onFeatureSelect = function(event){
        var feature = event.feature;
        var selectedFeature = feature;
        var popup = new OpenLayers.Popup.FramedCloud("chicken",
            feature.geometry.getBounds().getCenterLonLat(),
            new OpenLayers.Size(100,100),
            "<h3>"+feature.attributes.name + "</h3>",
            null, true, onPopupClose
        );
        feature.popup = popup;
        map.addPopup(popup);
    };
    
    var onFeatureUnselect = function(event){
        var feature = event.feature;
        if(feature.popup) {
            map.removePopup(feature.popup);
            feature.popup.destroy();
            delete feature.popup;
        }
    };

    return {
        init: init
    }

})();