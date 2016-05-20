import axios from "axios"

// https://voip.ms/api/v1/rest.php?api_username=fredp613@gmail.com&api_password=Fredp614$&method=getSMS
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
			messageStr += "Currently "
			messageStr += (parseInt(response.data.main.temp)/20).toString();
			messageStr += " degrees"
			console.log(messageStr);
			return callback(messageStr, null);
		}).catch((response)=>{
			console.log(response);
			return callback("error", "error");
		})
	
	}

};

const weather = new Weather;
export default weather;