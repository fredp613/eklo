import axios from "axios"

// https://voip.ms/api/v1/rest.php?api_username=fredp613@gmail.com&api_password=Fredp614$&method=getSMS
class Weather {
	constructor() {
			
	}
	
	test(keywords) {
		keywords ? this.keywords = keywords : [];
		console.log(this.keywords)
		console.log("hi we are askign for weather")	
	}
	
	getWeather(city, callback) {		
		const msg = "Current weather in " + city + " is 13 degrees";
		callback("Weather in ottawa: 13 degrees");
	}

};

const weather = new Weather;
export default weather;