import axios from "axios";
import Weather from "./workers/weather";
import News from "./workers/news";
import Message from "./models/Message";
import Context from "./classes/context"


export function start() {


	setInterval(()=> {
		const context = new Context();
		
		axios.get("https://voip.ms/api/v1/rest.php", {
			params: {
				api_username: process.env.EMAIL,
				api_password: process.env.VOIP_PWD,
				method: "getSMS",
				type: "1",
			}
		  })
		  .then(function (response) {		  	

		  	if (response.data.sms) {
		  				  		
		  		let messages = response.data.sms		  		
		  		
		  		messages.filter((event)=>{
		  				  			 
		  			newMessage(event.id, function(isNew) {
		  				if (isNew) {	
		  					context.getContext(event.message, (data)=>{
								console.log(event.message)	
								switch (data) {
									case "weather":														
										sendWeatherMessage(event)
										break;							
									case "news": 
										sendNewsMessage(event);
										break;
									case "unknown":
										sendUnknownContextMessage(event)
									default:
										break;

								}

							});	
		  				}
		  			})		  				
		  		})
		  	}		  			    	   
		  })
		  .catch((response) => {
		  	console.log(response)
		    // console.log(response.error);
		  });

	}, 2000)


}


////SERVICE FUNCTIONS
function sendUnknownMessage(event, callback) {
	let message = new Message({
		  message_id: event.id, 
		  did: event.did,
		  dst: event.contact, 
		  message: "The message you sent could not determine context. Please make sure that ...",	
		  responseSent: true 
		});	
	createAndSendMessageVOIP(message)
}

function sendWeatherMessage(event, callback) {

	Weather.getWeather("ottawa", (msg, err)=>{
		if (err) {
			console.log(err)
			return;
		}				  									
		let message = new Message({
		  message_id: event.id, 
		  did: event.did,
		  dst: event.contact, 
		  message: msg,	
		  responseSent: true 
		});		
		createAndSendMessageVOIP(message)
	});

}

function sendNewsMessage(event, callback) {

	News.getSearchResults(event.message, (msg, err)=>{
		if (err) {
			console.log(err)
			return;
		}				  									

		let message = new Message({
		  message_id: event.id, 
		  did: event.did,
		  dst: event.contact, 
		  message: msg,	
		  responseSent: true 
		});		
		createAndSendMessageVOIP(message)
	});

}





////HELPER FUNCTIONS

function createAndSendMessageVOIP(message) {
	createMessageDb(message, (data)=>{
			console.log(message)
			if (data == "success") {
				//send voip api message				  							
				sendMessage(message, (data)=>{
					if (data == "success") {
						console.log("message sent");
						callback("success")
					} else {
						callback("error")
						console.log("message not sent");
					}	
				})
			}
		});
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

function createMessageDb(message, callback) {
	message.save(function(err) {
				
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
				api_password: process.env.VOIP_PWD,
				method: "sendSMS",
				did: message.did,
				dst: message.dst,
				message: message.message
			}
		  })
		  .then((response) => {
		  	console.log(response);
		  	 return callback("success");
		  }).catch((response)=>{
		  	 return callback("error");
		  });
}











