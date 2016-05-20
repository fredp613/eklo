import axios from "axios";
import Weather from "./workers/weather";
import Message from "./models/Message";


export function start() {


	setInterval(()=> {
		 
		axios.get("https://voip.ms/api/v1/rest.php", {
			params: {
				api_username: process.env.EMAIL,
				api_password: process.env.VOIP_SMS_PWD,
				method: "getSMS",
				type: "1",
			}
		  })
		  .then(function (response) {
		  	console.log(response.data.sms.length)
		  	if (response.data.sms.length > 0) {		  		
		  		let messages = response.data.sms		  		
		  		messages.filter((event)=>{
		  			let message = event.message
		  			let messageId = event.id		  			 
		  			newMessage(messageId, function(data) {
		  				if (data) {
		  					console.log(message);
		  					if (message.indexOf("Weather") !== -1) {		  				
		  						
				  				Weather.getWeather("ottawa", (msg, err)=>{
				  					if (err) {
				  						return;
				  					}				  									
				  					let message = new Message({
									  message_id: messageId, 
									  did: event.did,
									  dst: event.contact, 
									  message: msg,	
									  responseSent: true 
									});		
				  					createMessage(message, (data)=>{

				  						if (data == "success") {
				  							//send voip api message				  							
				  							sendMessage(message, (data)=>{
				  								if (data == "success") {
				  									console.log("message sent");
				  								} else {
				  									console.log("message not sent");
				  								}	
				  							})
				  						}
				  					});
				  				});
		  					}
		  				}

		  			})		  				
		  		})
		  	}		  			    	   
		  })
		  .catch((response) => {
		    console.log(response.error);
		  });

	}, 2000)


}

//private methods
function newMessage(messageId, callback) {

	Message.findOne({message_id: messageId}, (err, doc)=>{
		if (doc) {			
			callback(false);	
		} else {			
			callback(true);
		}
	})

}

function createMessage(message, callback) {
	message.save(function(err) {
		console.log("creating")
		console.log(err)
		
		if (err) {			
			return callback("error");
		} else {			
			return callback("success");	
		}
		
	})

}

// https://voip.ms/api/v1/rest.php?api_username=fredp613@gmail.com&api_password=Fredp614$&method=sendSMS&did=6135021179&dst=6132202958&message=testing
function sendMessage(message, callback) {
	axios.get("https://voip.ms/api/v1/rest.php", {
			params: {
				api_username: process.env.EMAIL,
				api_password: process.env.VOIP_SMS_PWD,
				method: "sendSMS",
				did: message.did,
				dst: message.dst,
				message: message.message
			}
		  })
		  .then((response) => {
		  	 return callback("success");
		  }).catch((response)=>{
		  	 return callback("error");
		  });
}











