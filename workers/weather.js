import axios from "axios"


class Weather {
	constructor() {
			
	}
	
	// api.openweathermap.org/data/2.5/weather?id=2172797&APPID=7f3f737bf6c941de0057e89d4b6f6300
	
	getWeather(city, callback) {

		let messageStr = "";
		axios.get("http://api.openweathermap.org/data/2.5/weather", {
			params: {
				id:"2172797",
				APPID:"7f3f737bf6c941de0057e89d4b6f6300"
			}
		}).then((response)=>{			
			messageStr += "Current Temperature is "
			messageStr += (parseInt(response.data.main.temp)-273.15).toString().substring(0,4);
			messageStr += " degrees"
			// console.log(messageStr);
			return callback(messageStr, null);
		}).catch((response)=>{
			// console.log(response);
			return callback("error", "error");
		})
	
	}

};

const weather = new Weather;
export default weather;