import mongoose from 'mongoose';
const groupSchema=new mongoose.Schema({name:{type:String,required:true,trim:true,maxlength:80},description:{type:String,trim:true,maxlength:300,default:''},createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},members:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],inviteCode:{type:String,required:true,unique:true,index:true}},{timestamps:true});
export default mongoose.model('Group',groupSchema);
