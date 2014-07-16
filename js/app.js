App = Ember.Application.create();

var airports;
var airlines;

App.FlightResult = Ember.Object.extend({
  origin: '',
  dest: '',
  searchResult: null,
});

App.FlightResult.reopenClass({
  createRecord: function(orig, dest, flightResultData) {
    var flightResult = App.FlightResult.create({ origin: orig, dest: dest, searchResult: flightResultData  });
    //console.log("Creating Flight Result Object:"+ orig+"-->"+dest+"::"+flightResult);
    return flightResult;
  },
});

App.Flight = Ember.Object.extend({
  flightName: null,
  flightNumber:null,
  url: null,
  logo: null,
  origin: null,
  dest:null,
  terminal:null
});

App.Flight.reopenClass({
  createRecord: function(data) {
    return App.Flight.create({ 
      flightName: data.flightName, flightNumber: data.flightNumber});
  }
});


App.Router.map(function() {
  this.resource('about');

  this.resource('home', function () {
  this.resource('flightResult', { path: ':origin' }, function(){
    this.resource('flight', { path: ':flight' });
    });
});

});

App.IndexRoute = Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('about');
  }
});

// App.FlightRoute = Ember.Route.extend({
//  model: function(params) {

//     console.log("Creating flight object:" + params.flight);
//     var flight = App.Flight.create();
//       flight.setProperties({
//         flightNumber: params.flight,
//         flightName: params.airline
//     });
//     return flight;
//   }
// });

App.HomeRoute = Ember.Route.extend({

  actions: {
    searchFlight: function() {
      var origin = this.get('controller').get('origin');
      var dest = this.get('controller').get('dest');

      console.log("Searching flight for "+origin+"-->"+dest);
      var url = 'http://free.rome2rio.com/api/1.2/json/Search?key=Z8mvTtAn&oName='+origin+'&dName='+dest;
       this.get('controller').set('searching', true);
       this.get('controller').set('failure', false);
       this.get('controller').set('success', false);
      
      Ember.$.ajax(url, {
        type: 'GET',
        dataType: 'json',
        data: { origin: origin },
        context: this,
        success: function(data) {
          airports = data.airports;
          airlines = data.airlines;

          var flightResult = App.FlightResult.createRecord(origin, dest, data);
           this.get('controller').set('searching', false);
           this.get('controller').set('success', true);
           this.transitionTo('flightResult', flightResult);
        },
        error: function() {
          this.get('controller').set('searching', false);
          this.get('controller').set('failure', true);
          console.log('No flight found');
        }
      });


    }
  }
});


App.HomeController = Ember.ArrayController.extend({
  origin: '', dest : '',

  disabled: function() {
    return Ember.isEmpty(this.get('origin')) && Ember.isEmpty(this.get('dest'));
  }.property('dest')
});

Ember.Handlebars.helper('format-duration', function(dur) {
  if(dur < 60){
    return dur  + " min";
  }
  if(dur%60 == 0){
    return Math.floor(dur/60)+" hrs ";
  }
  return Math.floor(dur/60)+" hrs " + dur%60 + " min";
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

Ember.Handlebars.helper('getAirlineURL', function(airlineCode) {
  //console.log("Origin airport" + airlineCode);
  var airline = airlines.findBy('code', airlineCode);
  return airline.url;
});

Ember.Handlebars.helper('getAirlineLogo', function(airlineCode) {
  //console.log("Origin airport" + airlineCode);
  var airline = airlines.findBy('code', airlineCode);

  return  "http://www.rome2rio.com"+airline.iconPath;
});
