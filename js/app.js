App = Ember.Application.create();

var airports;
var airlines;
var origin;
var dest;

App.Router.map(function() {
  // put your routes here
  this.resource('about');
  //this.resource('search', {path : ':cityPair'});
    this.resource('flightResult');
 
  // this.resource('searchFlight', function() {
  //   this.resource('flightResult');
  // });

  this.resource('searchFlight', function() {
     this.resource('search', {path : '/:oName/:dName'}, function() {
        this.resource('flight', {path: '/:airline'});     
     });
  });

  
});


App.SearchRoute = Ember.Route.extend({
  model: function(params) {
      //console.log(params);
      console.log(params+"--->"+params.oName +", "+params.dName);

      origin =  params.oName;
      dest = params.dName;

      var url = 'http://free.rome2rio.com/api/1.2/json/Search?key=Z8mvTtAn&oName='+params.oName+'&dName='+params.dName;
      return Ember.$.getJSON(url).then(function(data) {
        airports = data.airports;
        airlines = data.airlines;
        //console.log(params.oName+ "-->" + airports);
        //origin = airports.findBy('code', params.oName).name;
       return data;
      });
  }
});


Ember.Handlebars.helper('format-time', function(time) {
  return moment(time, 'hh:mm').format('hh:mm A');
});

Ember.Handlebars.helper('getAirportName', function(code) {
  //console.log(airports.findBy('code', code).name);
  var airport = airports.findBy('code', code);
  //this.set('orgAirport', airport.name + " ( " + code +")");
  return airport.name + " ( " + code +")";
});

Ember.Handlebars.helper('getOrigAirportName', function() {
  //console.log("Origin airport" + origin);
  //var airport = airports.findBy('code', origin);
  //return airport.name + " ( " + origin +")";
  return origin;
});

Ember.Handlebars.helper('getAirlineDetail', function(airlineCode) {
  //console.log("Origin airport" + airlineCode);
  var airline = airlines.findBy('code', airlineCode);
  return airline.name;
});


// Ember.Handlebars.helper('getAirlineWebsite', function(airlineCode) {
//   //console.log("Origin airport" + airlineCode);
//   var airline = airlines.findBy('code', airlineCode);
//   return airline.url;
// });
//  <i class="icon-airline" style="background:url(/images/airlines/airlinesD1.gif?v=2014616) no-repeat top right; background-position: 0px -1886px" title="American Airlines"></i>

Ember.Handlebars.helper('getAirlineLogo', function(airlineCode) {
  //console.log("Origin airport" + airlineCode);
  var airline = airlines.findBy('code', airlineCode);

  return  "http://www.rome2rio.com"+airline.iconPath;
});


Ember.Handlebars.helper('format-duration', function(dur) {
  //return dur;
  if(dur < 60){
    return dur  + " min";
  }
  if(dur%60 == 0){
    return Math.floor(dur/60)+" hrs ";
  }

  return Math.floor(dur/60)+" hrs " + dur%60 + " min";
  //moment(dur, 'mm').format('hh mm');
});

// App.FlightRoute = Ember.Route.extend({
//   model: function(params) {
//       console.log(params);
//       console.log(params+"--->"+params.oName +", "+params.dName);
//       var url = 'http://free.rome2rio.com/api/1.2/json/Search?key=Z8mvTtAn&oName='+params.oName+'&dName='+params.dName;
//       return Ember.$.getJSON(url)
//   }
// });



