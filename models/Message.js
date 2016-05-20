
import mongoose from "mongoose";

const Schema = mongoose.Schema;


const messageSchema = new Schema({
  message_id: {type: String},    
  did: {type: String}, 
  dst: {type: String},  
  message: {type: String},   
  responseSent: { type: Boolean}
});

// messageSchema.methods.existingMessage = function (cb) {	
//   return this.model('Voip_sMessage').find( { message_id: this.message_id }, cb);
// }

var Message = mongoose.model('messages', messageSchema);
module.exports = Message;
