import axios from "axios"
import _ from "lodash";

class Weather {
	constructor() {
			
	}
	
	// api.openweathermap.org/data/2.5/weather?id=2172797&APPID=7f3f737bf6c941de0057e89d4b6f6300
	
	getWeather(city, callback) {

		let messageStr = "";
		axios.get("http://api.openweathermap.org/data/2.5/weather", {
			params: {
				q: city,
				APPID: process.env.WEATHER_API_KEY,
			}
		}).then((response)=>{		
			console.log(response.data.weather)	
			messageStr += "Current Temperature is "
			messageStr += (parseInt(response.data.main.temp)-273.15).toString().substring(0,4);
			messageStr += " degrees"			
			return callback(messageStr, null);
		}).catch((response)=>{
			// console.log(response);
			return callback("error", "error");
		})
	
	}

	getWeatherForecast(city, callback) {
		
		axios.get("http://api.openweathermap.org/data/2.5/forecast", {
			params: {
				// id:"2172797",
				q: city,
				APPID:"7f3f737bf6c941de0057e89d4b6f6300"
			}
		}).then((response)=>{		
					
			console.log(response.data.list);

			const weatherForecastArr = this.getWeatherForecastArr(response.data.list, (e)=>{
				e.forEach((w)=>{
					let msg = w.date + ": Min Temp: " + (parseInt(w.tempMin) - 273.15).toString().substring(0,4) + ", Max Temp: " + (parseInt(w.tempMax) - 273.15).toString().substring(0,4)
					// return callback(msg, null) 
					console.log(msg)
					return callback(msg, null);
				})				
			})
					 			 				 			 

		}).catch((response)=>{
			console.log(response);
			return callback("error", "error");
		})

	}

	dateAlreadyExists(data, callback) {
		let dates = [];
		for (var i=0;i<=data.length -1;i++) {			
			dates.push(data[i].dt_txt.substring(0,10))
		}
		let unique = [...new Set(dates)];

		return callback(dates);		
	}

	getWeatherForecastArr(data, callback) {

		let weatherObjects = [];

		const dates = _.uniqBy(data, (event)=>{
			return event.dt_txt.substring(0,10);
		});

		dates.filter((event)=>{
			weatherObjects.push(event.dt_txt.substring(0,10));
		})

		let newObj = [];

		weatherObjects.forEach((event)=>{		
			let dd = event
			data.filter((d)=>{		
				if (d.dt_txt.indexOf(event) > -1) {
					const t = {
						"date": event,
						"temps": [d.main.temp_min, d.main.temp_max]
					}
					newObj.push(t);			
				}
			})
		});

		let eee = [];

		weatherObjects.forEach((event)=>{
			let dd = event;
			let tres = {
				date: dd,
				temps: [],
			}
			newObj.filter((e)=>{
				if (e.date == dd) {			
					tres.temps.push(e.temps[0]);
				}
			})
			eee.push(tres)

		});

		let final = [];
		eee.filter((e)=>{
			let f = {
				date: e.date,
				tempMin: _.min(e.temps),
				tempMax: _.max(e.temps),
			}
			final.push(f);
		})



		return callback(final);


	}
	
};

const weather = new Weather;
export default weather;