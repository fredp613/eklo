import axios from "axios"
import Weather from "./workers/weather"


export function start() {


// axios.get('/user', {
//     params: {
//       ID: 12345
//     }
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (response) {
//     console.log(response);
//   });

	setInterval(()=> {
		 

		//GET USERS AND ITERATION ASYNC THROUGH THEM 

		axios.get("https://voip.ms/api/v1/rest.php", {
			params: {
				api_username: process.env.EMAIL,
				api_password: process.env.VOIP_SMS_PWD,
				method: "getSMS"
			}
		  })
		  .then(function (response) {
		  	console.log(response.data.sms.length)
		  	if (response.data.sms.length > 0) {		  		
		  		let messages = response.data.sms		  		
		  		messages.filter((event)=>{
		  			let message = event.message
		  			let messageId = event.id
		  			
		  			if (!existingMessage(messageId)) {
		  				if (message.indexOf("weather") !== -1) {		  				
			  				Weather.getWeather("ottawa", (msg)=>{
			  					//send text of weather object
			  					console.log(msg);	

			  				});
		  				}
		  			}
		  			

		  		})
		  	}		  	
		    console.log(response.data.status);		    
		  })
		  .catch(function (response) {
		    console.log(response.error);
		  });

	}, 2000)


}


//private methods
function existingMessage(messageId) {
	if (1 == 2) {
		return true
	}
	return false
}