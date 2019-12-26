var express = require('express');
var router = express.Router();
const axios = require('axios'); // Import for easy handle requests
const request = require('request'); // For more handle data-form requests

/* GET home page. */
router.get('/', async function(req, res, next) {
  let location = 0;
  let pharmacy = "";
  if (typeof req.query.location !== 'undefined') {
    location = req.query.location; // Location's name
  }
  if (typeof req.query.pharmacy !== 'undefined') {
    pharmacy = req.query.pharmacy; // fk_comuna
  }
  let coordinates = []; // Data for map
  let locations = await getLocationsWithIdRegion("7");
  let pharmacies = await getPharmacies(location , pharmacy);
  pharmacies.forEach(el => {
    coordinates.push([el.local_nombre, parseFloat(el.local_lat), parseFloat(el.local_lng)]);
  })
  res.render('index', { title: 'Buscador de Farmacias', locations, data: JSON.stringify(coordinates) });
});

/* GET locations with id_region */
function getLocationsWithIdRegion(id_region) {
	return new Promise((resolve, reject) => {
		request.post('https://midastest.minsal.cl/farmacias/maps/index.php/utilidades/maps_obtener_comunas_por_regiones', {
			formData: {reg_id: id_region},
		}, (error, res, body) => {
			if (error) {
				reject(error);
			}
			resolve(body);
		})
	});
}

/* GET pharmacies with id_region . */
function getPharmacies(location, pharmacy) {
	return new Promise((resolve, reject) => {
		axios.get('http://localhost:3000/pharmacies?location='+location+'&pharmacy='+pharmacy)
		.then(function (response) {
			resolve(response.data);
		})
		.catch(function (error) {
			console.log(error);
			reject(error);
		}); 
	});
}
module.exports = router;
