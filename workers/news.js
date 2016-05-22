import axios from "axios"
import googl from "goo.gl"


class News {
	constructor() {
			
	}
	
	

	getSearchResults(keyword, callback) {

		const params = {
			Query:keyword.toLowerCase(),	
		}
		//this stupid api requires a base64 key
		const apiKey = process.env.BING_API_KEY
		
		const base64ApiKey = new Buffer(apiKey + ":" + apiKey).toString('base64')

		const config = {
 			 headers: {
 			 	"Authorization": "Basic " + base64ApiKey, 			 	
 			 }
		};

		let category = this.getCategory(keyword) ? ("&NewsCategory=" + this.getCategory(keyword)) : "";
		
		axios.post("https://api.datamarket.azure.com/Bing/Search/v1/News?Query=%27"+keyword+"%27"+category, params, config)
		.then((response)=>{						
					
			console.log(response.data.d.results)

			var rrr = response.data.d.results[1];

			googl.setKey("AIzaSyCVToVNB1ItRtS6CtFGJaHfAZStVr34wtI");
			googl.getKey();

			googl.shorten(rrr.Url)
				.then((shortUrl)=>{
					const message = rrr.Title + "\n" + "Source: " + rrr.Source + "\n" + shortUrl		
					return callback(message)
				}).catch((err)=>{
					console.log(err)
					return callback("error", "error")
				})



					

			// response.data.d.results.forEach((result)=>{
			// 	const message = result.Title + "\n" + "Source: " + result.Source + "\n" + result.Url				
			// 	callback(message);
			// })

			// console.log(messageStr);
			
		}).catch((response)=>{
			console.log(response);
			return callback("error", "error");
		})
	
	}

	getCategory(word) {
		if (word.indexOf("sport") > -1) {
			return "%27rt_Sports%27";
		}

		if (word.indexOf("business") > -1) {
			return "%27rt_Business%27";
		}

		if (word.indexOf("entertainment") > -1) {
			return "%27rt_Entertainment%27";
		}

		if (word.indexOf("health") > -1) {
			return "%27rt_Health%27";
		}
		if (word.indexOf("politics") > -1) {
			return "%27rt_Politics%27";
		}
		if (word.indexOf("world") > -1) {
			return "%27rt_World%27";
		}
		if (word.indexOf("science") > -1) {
			return "%27rt_Science%27";
		}
		if (word.indexOf("technology") > -1) {
			return "%27rt_Technology%27";
		}
		return null;

	}

};

const news = new News;
export default news;