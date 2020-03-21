var map;



function init_MY_Map() {
	    
	    // Loading My Map
	
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 9,
          center: {lat: 30.460833, lng: 31.187500},
        });
			 
			 
	      // make the map responsive
			 
		google.maps.event.addDomListener(window, "resize", function() {
			var center = map.getCenter();
			google.maps.event.trigger(map, "resize");
			map.setCenter(center);
		});
	
	 // Start My View Model
	
	ko.applyBindings(new MyViewModel());
	
      
}
		
// Array Of Locations

 var Markers = [];

 var locations = [
          {title: 'banha', location: {lat: 30.4660, lng: 31.1848}},
          {title: 'tanta', location: {lat: 30.7865, lng: 31.0004}},
          {title: 'cairo', location: {lat: 30.0444, lng: 31.2357}},
          {title: 'El-mansoura',location: {lat:31.0409 ,lng:31.3785}},
          {title: 'zagazig', location: {lat:30.5765 , lng:31.5041 }},
          {title: 'ismailia', location: {lat:30.5965 , lng: 32.2715}}
        ];



// Start View MOdel

var MyViewModel = function (){
	
	 var self = this;
	 this.filterLocation = ko.observable("");
	 this.list_locations = ko.observableArray([]);
	
	// create my locations on my map
	
	for(var i=0; i < locations.length; i++) {
		self.list_locations.push(new Create_My_Location(locations[i]));
	}
	
	this.Check_My_Filter = function ()
	{
		var ff = self.filterLocation().toLowerCase();
		for (var i = 0; i < self.list_locations().length; i++)
		{
			var pp = self.list_locations()[i].name.toLowerCase();
			if(pp.search(ff) >= 0)
			{
				self.list_locations()[i].visible(true);
			}
			else
			{
				self.list_locations()[i].visible(false);
			}
		}
	};
};

//  create locations

var Create_My_Location = function (mylocation){

  	var self = this;
	this.name = mylocation.title;
	this.lat = mylocation.location.lat;
	this.lng = mylocation.location.lng;
	this.timezone = "unknown";
	this.temperature = "unknown";
	this.pressure = "unknown";
	this.summary = "unknown";
	this.icon = "unknown";
	this.visible = ko.observable(true);
	
	
	// Create Markers 
  	self.marker = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(mylocation.location.lat, mylocation.location.lng),
		title: mylocation.title,
		animation: google.maps.Animation.DROP,
	});
	
	// function for showing marker or not
	self.showTheMarker = ko.computed(function() {
		if(self.visible() === true)
		{
			self.marker.setMap(map);
		}
		else
		{
			self.marker.setMap(null);
		}
		return true;
	}, self);
	
	
	// url of place from dark sky website 
	var url_of_dark_sky_api  = 'https://api.darksky.net/forecast/165048d74caa6b84f80a61b7150309ae/'+this.lat+','+this.lng;
	//console.log(url_of_dark_sky_api);	
	var exclude = "?exclude=minutely,hourly,daily,alerts,flags";
    var unit = "?units=si";
	url_of_dark_sky_api += exclude + unit;
	// using ajax function for handle error
	$.ajax({
      url: url_of_dark_sky_api,
      dataType: "jsonp",
      success: function (weatherData) { 
		  // timezon
		self.timezone = weatherData.timezone;
		  // temprature
		self.temperature = weatherData.currently.temperature;
		  // pressure
		self.pressure = weatherData.currently.pressure;
		  // icon
		self.icon = weatherData.currently.icon;
		  // summary
		self.summary = weatherData.currently.summary;
		  
	
		// adding infowindow to location
		self.contentOfInfoWindow = '<div class="info-window-content"><div class="title"><b>';
		self.contentOfInfoWindow += "title: "+self.name + '</b></div>' ;
		self.contentOfInfoWindow += '<div class="content">' +"timezone: "+ self.timezone + '</div>' ;
		self.contentOfInfoWindow += '<div class="content">' +"temperature: "+self.temperature + '</div>' ;
		self.contentOfInfoWindow += '<div class="content">' +"icon: "+ self.icon + '</div>' ;
		self.contentOfInfoWindow += '<div class="content">' +"summary: "+ self.summary + '</div>' ;
		self.contentOfInfoWindow += '<div class="content">' +"pressure: "+ self.pressure + '</div></div>' ;

		//create new infoWindow
		self.infoWindow = new google.maps.InfoWindow({content: self.contentOfInfoWindow});

		// adding listener to the marker
		self.marker.addListener('click', function() {

			self.contentOfInfoWindow = '<div class="info-window-content"><div class="title"><b>';
			self.contentOfInfoWindow += "title: "+self.name + '</b></div>' ;
			self.contentOfInfoWindow += '<div class="content">' +"timezone: "+ self.timezone + '</div>' ;
			self.contentOfInfoWindow += '<div class="content">' +"temperature: "+ self.temperature + '</div>' ;
			self.contentOfInfoWindow += '<div class="content">' + "icon: "+self.icon + '</div>' ;
			self.contentOfInfoWindow += '<div class="content">' +"summary: "+ self.summary + '</div>' ;
			self.contentOfInfoWindow += '<div class="content">' +"pressure: "+ self.pressure + '</div></div>' ;
			self.infoWindow.setContent(self.contentOfInfoWindow);

			self.infoWindow.open(map, this);

			self.marker.setAnimation(google.maps.Animation.BOUNCE);

			setTimeout(function() {
	      		self.marker.setAnimation(null);
	     	}, 1000);
		});
	  }
	}).fail(function(){
		alert("error on loading api from dark sky website!");
	});
	
	self.activemarker = function()
	{
		google.maps.event.trigger(self.marker, 'click');
	};
	
	
};


// hundle error 
function Handle_error() {
	alert("Google Maps has failed to load. Please check your internet connection and try again.");
}

function active(ob)
{
	alert(ob);
}


	





















