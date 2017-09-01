//////////////////////////////////////////////////
// Define GMapLight Class
//////////////////////////////////////////////////

/** GMapLight 
 * This class encapsulates the Map functionnalities supplied by Google Map.
 *
 */	
/**
 * @author Hell
 */
/**
 *  GMapLight Class Definition 
 */
var GMapLight = (function () {
	var GMapLight = function(mapId, type) {
//		alert('Enter Constructor GMapLight(' + mapId + ')');
        console.log("Executing RenelMapFull() Constructor...");
        // Definition of the Icon used to display the Markers
        this.customIcons = {
          OFF: {
            icon: 'images/pin_inactive.png'  
          },
          ON: {
            icon: 'images/pin_active1.png'
          },
          INVISIBLE: {
            icon: 'images/pin_invisible.png'
          },
          START: {
            icon: 'images/flag_green.png'
          },
          END: {
            icon: 'images/flag_red.png'
          },
          POS: {
            icon: 'images/pin-yellow.png'
          },
          POS_OK: {
            icon: 'images/pin-green.png'
          },
          POS_NOK: {
            icon: 'images/pin-red.png'
          },
            
        };
        this.mapId = $('[id$=' + mapId + ']');	// Id of the HTML Element holding the Map
        this.map = null;                		// Google Map Object instance
        this.type = (type!=null) ? type : this.RENELMAP_TYPE.TRACKING;
        this.client = ""                // PC or Mobile Device
        
        this.center = new google.maps.LatLng(46.541100900, 6.582000600);
        this.zoom = 10;
        this.mapProperties = null;
        this.mapTypeId = google.maps.MapTypeId.ROADMAP;
        
		this.currentLocation = null;
		this.destLocation = null;

		this.currentMarker = null;
		this.destMarker = null;

        this.refreshRate = 5000;        // Frequency of the Markers Refresh
        this.timerId = null;            // Timer used for Markers Refresh
        this.running = false;           // This Flag is set to true once everything has started
                                        // It is used within onDeviceLocation Event Handler
                                        
        this.routeOnly = false;         // Indicates to draw the Route based upon Start & End Position of the History
        this.pathOnly =  false;         // Indicates to draw the Path according to all the Positions of the History
        this.routeOK = false;			// Indicates that the Route has been drawn and is visible
        
		this.directions = {};
        this.directionsDisplay = null;  // Google Map Resource used for Route processing
        this.directionsService = null;  // Google Map Resource used for Route processing
        this.flightPath = null;         // Holds Google Map current PolyLine 
        
        this.geocoder = null;
        
        this.routeProcessing = null;	// Interval responsible for drawing the Route. Terminated when routeOK Flag is true
        
        this.initialize();
//		alert('Exit Constructor GMapLight()');
	};
	
	GMapLight.prototype = {
        RENELMAP_TYPE: {TRACKING: 'TRACKING', HISTORY: 'HISTORY'},
        sayHello: function() {
          alert(this.RENELMAP_TYPE.TRACKING);  
        },
		initialize: function() {
		var thisMap = this;
            console.log("Executing RenelMapFull.initialize()...");
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                this.client = "Mobile";
            }
            else {
                this.client = "PC";
            }
            // Initialize Google Map additional Services for Route rendering
    		thisMap.directionsDisplay = new google.maps.DirectionsRenderer({polylineOptions: {strokeColor: "#0000ff"}, 
				 suppressMarkers: true });
    		thisMap.directionsService = new google.maps.DirectionsService();
		},
		setCurrentLocation: function (position) {
		var thisMap = this;
		if((position.coords!==undefined) && (thisMap.currentLocation==null)) {
			thisMap.currentLocation = position;
			thisMap.mapId.gmapready(function(gmap, markers) {
					var centerPos = new google.maps.LatLng(thisMap.currentLocation.coords.latitude, thisMap.currentLocation.coords.longitude);
					gmap.setCenter(centerPos);
					thisMap.setMarker(gmap, centerPos, true);
//					google.maps.event.addListener(gmap, 'click', function(event) {
//						thisMap.setMarker(gmap, event.latLng, true);
//					});
				});
			}
		},
		setLocation: function(position) {
		var thisMap = this;
		var pos = position;
			if(position!==undefined) {
				thisMap.mapId.gmapready(function(gmap,markers) {
					var centerPos = pos;
//					gmap.setCenter(centerPos);
					thisMap.setMarker(gmap, centerPos, false);
//					google.maps.event.addListener(gmap, 'click', function(event) {
//						thisMap.setMarker(gmap, event.latLng, false);
//					});
				});
			}
		},
		setAddressLocation: function(address) {
		var thisMap = this;
		var geocoder = new google.maps.Geocoder();
			geocoder.geocode({'address': address}, function(results, status) {
				if(status == google.maps.GeocoderStatus.OK) {
					var location = results[0].geometry.location;
					thisMap.setLocation(location);
				}
				else {
					alert('Error: Can\'t find the address location ...');
				}
			});
		},
		centerToBounds: function(gmap) {
		var thisMap = this;
			thisMap.mapId.gmapready(function(gmap) {
				var bounds = new google.maps.LatLngBounds();
				bounds.extend(thisMap.currentMarker.getPosition());	
				bounds.extend(thisMap.destMarker.getPosition());	
				gmap.fitBounds(bounds); 
			});
		},
		setMarker: function(gmap, pos, current) {
		var thisMap = this;
			if(current==true) {
				//add marker if and info window at north end of main street
				this.currentMarker = new google.maps.Marker({
						icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
				        position:  pos,
				        map: gmap,
				        title: 'My Location',  
				        clickable: true
				 });  
				 var infowindow1 = new google.maps.InfoWindow({
				   content: "My Current Location"
				 });
				 google.maps.event.addListener(thisMap.currentMarker, 'click', function() {
				   infowindow1.open(gmap,thisMap.currentMarker);
				 });
			}
			else {
				this.destMarker = new google.maps.Marker({  
					icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
			        position:  pos,
			        map: gmap,
			        title: 'Selected Position',  
		            clickable: true
				 });  
				 var infowindow1 = new google.maps.InfoWindow({
				   content: "My Destination"
				 });
				 google.maps.event.addListener(thisMap.destMarker, 'click', function() {
				   infowindow1.open(gmap, thisMap.destMarker);
				 });
//				 thisMap.drawRoute();
			}
		},
		removeMarkers: function() {
		var thisMap = this;
			thisMap.currentMarker.setMap(null);
			thisMap.destMarker.setMap(null); 
		},
		showMarkers: function(visible) {
		var thisMap = this;
			thisMap.currentMarker.setVisible(visible);
			thisMap.destMarker.setVisible(visible); 
		},
		
		drawRoute: function() {
		var thisMap = this;

			thisMap.routeProcessing = window.setInterval(function() {
				thisMap._drawRoute();
			}, 1000);
		},
		_drawRoute: function() {
		var thisMap = this;
		
			if((thisMap.currentMarker!=undefined) && (thisMap.destMarker!=undefined)) {
				thisMap.mapId.gmapready(function(gmap) {
					// Clear Route if any ...
					thisMap.directionsDisplay.setDirections({routes: []});
					// Set the Current Marker (Current Position) as Route Start
					thisMap.directions.start = thisMap.currentMarker.getPosition();
					// Set the Destination Marker (Destination Position) as Route End
					thisMap.directions.end = thisMap.destMarker.getPosition();
					thisMap.directionsService.route({origin: thisMap.directions.start,
													 destination: thisMap.directions.end,
													 travelMode: google.maps.TravelMode.DRIVING
			    									},
			    									function(result, status) {
			    										if (status == google.maps.DirectionsStatus.OK) {
			    											thisMap.directionsDisplay.setDirections(result);
			    											thisMap.directionsDisplay.setMap(gmap);
			    											thisMap.centerToBounds();
			    											thisMap.routeOK = true;
			    											window.clearInterval(thisMap.routeProcessing);
			    										} 
			    										else {
			    											alert("Directions Request failed:" + status);
			    											thisMap.directions.start = null;
			    											thisMap.directions.end = null;
			    											thisMap.routeOK = false;
			    										}
			    									});
				});
			}
			else {
				window.plugins.infobox.showInfo('Waiting for GPS Data ...', 0);				
				thisMap.routeOK = false;
			}
		}
	};		
	return GMapLight;
})();
