import { Schema } from "mongoose";

const meetingScehema = new Schema(
    {
        user_id : {type:String},
        meetingCode : {type:String,required: true},
        date : {type: Date, default: Date.now,required:true}
    }
)

const Meeting = mongoose.model("Meeting", meetingScehema);

export {Meeting};