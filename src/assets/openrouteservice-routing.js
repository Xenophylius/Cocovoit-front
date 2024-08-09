L.Routing.OpenRouteService = L.Class.extend({
    initialize: function (options) {
      L.Util.setOptions(this, options);
    },
  
    route: function (waypoints, callback, context) {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson?api_key=${this.options.apiKey}`;
      
      const coords = waypoints.map(waypoint => [waypoint.latLng.lng, waypoint.latLng.lat]);
  
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coordinates: coords
        })
      })
      .then(response => response.json())
      .then(data => {
        const route = L.GeoJSON.geometryToLayer(data.routes[0].geometry);
        callback.call(context, null, route);
      })
      .catch(error => {
        callback.call(context, error);
      });
    }
  });
  
  L.Routing.openRouteService = function (options) {
    return new L.Routing.OpenRouteService(options);
  };
  