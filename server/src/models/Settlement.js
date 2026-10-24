import mongoose from 'mongoose';
const settlementSchema=new mongoose.Schema({group:{type:mongoose.Schema.Types.ObjectId,ref:'Group',required:true,index:true},fromUser:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},toUser:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},amountMinor:{type:Number,required:true,min:1},recordedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},note:{type:String,trim:true,maxlength:200,default:''}},{timestamps:true});
export default mongoose.model('Settlement',settlementSchema);
