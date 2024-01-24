const Chat = require("../models/Chat");
const { StatusCodes } = require("http-status-codes");
const Request = require("../models/Request");
const User= require("../models/User");
const Activity=require("../models/Activity");
const CustomError = require("../errors");
const Message = require("../models/Message");
const cloudinary = require("cloudinary").v2;
 const  createChat = async (req, res) => {
  req.body.from=req.user.userId;
  const chat = await Chat.create(req.body);
  res.status(StatusCodes.CREATED).json({ chat });
};

updateChat= async (req, res) => {
  let result = await Pet.findOne({ _id: req.params.id });
  
   result = await Pet.findOneAndUpdate({ _id: result._id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.CREATED).json({ result });
};

const getChatById = async (req, res) => {
  result = await Chat.findOne({ _id: req.params.id });
  res.status(StatusCodes.CREATED).json({ result });
};


const getUserChats = async (req, res) => {
  result = await Chat.find({ $or:[{from:req.user.userId},{to:req.user.userId}],is_active:true}).sort({updatedAt:-1}).lean();

 result=await   Promise.all(result.map(async entry=>{
    
       if(entry.from)
       {
        
          let from =await User.findOne({_id:entry.from});
          if(from)
          {
               entry.from_name = from.name ? from.name : null;
          }
         
       }

       if (entry.to) {
        
         let to = await User.findOne({ _id: entry.to });
         if(to)
         {
         entry.to_name = to.name ? to.name : null;
         }
       }
       return entry;
       
  }));
  res.status(StatusCodes.OK).json({ result});
};

const getChatMessages=async (req, res) => {
    result = await Message.find({
       chatId: req.params.id,
    }).sort({ updatedAt: -1 });
    res.status(StatusCodes.OK).json({ result });
}

const addMessage=async (req,res)=>{
  let chat=Chat.findOne({_id:req.params.id});
   if(!chat)
   {
    throw new CustomError.NotFoundError(`No chat found for for id: ${req.params.id}`);
   }
    
    req.body.chat_id=req.params.id;
    req.body.sender_id=req.user.userId;
     result = await Message.create(req.body);
     res.status(StatusCodes.OK).json({ result });
}

const sendRequest = async (req, res)=>{
   req.body.from=req.user.userId;
   const result=await Request.create(req.body);
    res.status(StatusCodes.CREATED).json({ result });
};

const updateRequest = async (req, res)=>{
  let result=await Request.findOne({_id:req.params.id}).lean();
  if(!result)
  {
    throw new CustomError.NotFoundError(`No entry found for given id: ${req.params.id}`);
  }
  if(req.body.status && req.body.status==="ACCEPTED")
  {
     await Chat.create({from:req.user.userId,to:result.from});
      
  }
  let user=await User.findOne({_id:req.user.userId});
  await Activity.create({
    type:"REQUEST",
    heading: `${user.name} has ${req.body.status} your request`,
    description: `${user.name} has ${req.body.status} your request`,
    user: result.from,
    request_id:result._id,
  });
  
  result=await Request.findOneAndUpdate({_id:req.params.id},req.body,{new:true,runValidators:true});
   res.status(StatusCodes.CREATED).json({ result });
};

const getIncomingRequests=async (req, res) =>
{
    let result=await Request.find({is_active:true,to:req.user.userId});
    res.status(StatusCodes.OK).json({ result });
}

const getSentRequests=async (req, res) =>{
    let result = await Request.find({ is_active: true, from: req.user.userId });
    res.status(StatusCodes.OK).json({ result });
}

const getRequestById = async (req, res) => {
  let result = await Request.find({ is_active: true, _id: req.params.id});
  if(!result) {
    throw new CustomError.NotFoundError(`No such request with id ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ result });
};

const getUserNotifications =async  (req, res) => {
  const result=await Activity.find({is_active:true,user:req.user.userId});
  res.status(StatusCodes.OK).json({ result });
};

module.exports = {
 createChat,
 updateChat,
 getChatById,
 getUserChats,
 getChatMessages,
 addMessage,
 sendRequest,
 updateRequest,
 getIncomingRequests,
 getSentRequests,
 getRequestById,
 getUserNotifications
};
