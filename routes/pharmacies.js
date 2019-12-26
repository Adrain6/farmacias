var express = require('express'); // Expres for handle Restfull 
var router = express.Router();  // Get routes, in this case /pharmacies as prefix
const axios = require('axios'); // Import for easy handle requests

/* GET pharmacies with filter . */
router.get('/', async function(req, res, next) {
	location = +req.query.location; // Location's name
	pharmacy = req.query.pharmacy; // fk_comuna

	let pharmacies = await getPharmaciesWithIdRegion("7"); // Async call to promise
	let out = [];
	// Type filter both = Pharmacy and location, location = only location, charmacy = only pharmacy, all = no pharmacy and location
	let typeFilter = "all";
	if(location !== 0 && pharmacy !== "") { // All locations
		typeFilter = "both"
	} else if(location !== 0) {
		typeFilter = "location"
	} else if(pharmacy !== ""){
		typeFilter = "pharmacy"
	}
	pharmacies.forEach(el => {
		switch (typeFilter) { // What type of filter we will use
			case "both": // Filter with pharmacy and location
				if(el.local_nombre.includes(pharmacy.toUpperCase()) && el.fk_comuna == location) {
					out.push(el);
				}
				break;
			case "location":
				if(el.fk_comuna == location) {
					out.push(el);
				}
				break;
			case "pharmacy":
				if(el.local_nombre.includes(pharmacy.toUpperCase())) {
					out.push(el);
				}
				break;
			default: // Send all by default
				out = pharmacies;
				break;	
		}

	})
	res.send(out);
});

/* GET pharmacies with id_region . */
function getPharmaciesWithIdRegion(id_region) {
	return new Promise((resolve, reject) => {
		axios.get('https://farmanet.minsal.cl/maps/index.php/ws/getLocalesRegion?id_region=' + id_region)
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
