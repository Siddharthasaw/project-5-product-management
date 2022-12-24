const express = require("express")
const mongoose = require("mongoose")
const userModel = require("../user/userModel")
const { isValidString,isValidEmail,isValidMobileNo,isValidPassword,isValidpincode,isValidBody,isValidName,isValidFile,isValidUserName} = require('../validator/validator')
const {uploadFile} = require('../aws/aws');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createUser  = async function (req, res) {
    try {
    let data = req.body;
    let files = req.files;
   
        let { fname,lname,email,phone,password,address } = data;

        address = JSON.parse(address);
        // address=JSON.parse(address);

        if (Object.keys(data).length == 0) return res.status(400).send({ msg: "all data is required"
        });
        if (!fname || !isValidString(fname)) return res.status(400).send({ msg: "first name is required"});
        if (!lname || !isValidString(lname)) return res.status(400).send({msg: "last name is required"});

        if (!email || !isValidString(email)) return res.status.send(400).send({msg: "email id is required" });
        if (!isValidEmail(email)) return res.status.send({msg: "email is not valid please provide valid email"});

        let checkemail = await userModel.findOne({email});
        if (checkemail) return res.status(400).send({status: false,msg: " this emailId already register"});


        if (!phone) return res.status(400).send({ status: false, message: "phone is required"})
        if (!isValidMobileNo(phone)) return res.status(400).send({status: false,message: `${phone} is not a valid phone.`})

        const isPhoneAlreadyUsed = await userModel.findOne({phone})
        if (isPhoneAlreadyUsed) {
            return res.status(409).send({status: false, message: `${phone} is already in use, Please try a new phone number.`})
        }

        if (files.length === 0) return res.status(400).send({status: false,message: "Profile Image is mandatory"})
        if (!password) return res.status(400).send({status: false, message: "password is required"})
        if (!isValidPassword(password)) return res.status(400).send({status: false, msg: "Please provide a valid Password with min 8 to 15 char with Capatial & special (@#$%^!)"})
      
        if (!address) return res.status(400).send({ status: false, message: "address is required"})
        if (address.shipping) {

            if (!isValidString(address.shipping.street)) return res.status(400).send({status: false,message: "Shipping address's Street Required"})
            if (!isValidString(address.shipping.city)) return res.status(400).send({status: false, message: "Shipping address city Required"})
            if (!(address.shipping.pincode)) return res.status(400).send({status: false,message: "Shipping address's pincode Required"})
            if (!isValidpincode(address.shipping.pincode)) return res.status(400).send({status: false,message: "Shipping Pinecode is not valide"})

        } else {
            return res.status(400).send({ status: false, message: "Shipping address cannot be empty."})
        }
        // Billing Address validation

        if (address.billing) {
            if (!isValidString(address.billing.street)) return res.status(400).send({status: false,message: "billing address's Street Required"})
            if (!isValidString(address.billing.city)) return res.status(400).send({status: false,message: "billing address city Required"})
            if (!(address.shipping.pincode)) return res.status(400).send({status: false,message: "billing address's pincode Required"})
            if (!isValidpincode(address.billing.pincode)) return res.status(400).send({status: false,message: "billing Pinecode is not valide"})

        } else
            return res.status(400).send({status: false,message: "Billing address cannot be empty."})
    
        let profileImage = await uploadFile(files[0]); //upload image to AWS
        if(!isValidFile(profileImage))
        {
          return res.status(400).send({status:false, message:"file formet is wrong"})
        }
        const encryptedPassword = await bcrypt.hash(password, 10) //encrypting password by using bcrypt.

        //object destructuring for response body.
        const userData = {fname,lname,email,profileImage,phone,password: encryptedPassword,address}
        const saveUserData = await userModel.create(userData);
        return res.status(201).send({status: true, message: "user created successfully.", data: saveUserData});

    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}


//***************************************************** [user login] *****************************************************************
const loginUser = async function (req, res) {
   try {
    let loginData = req.body
    let { email, password } = loginData

    if (!isValidBody(loginData)) return res.status(400).send({ status: false, message: "Please fill email or password" })
    
    if (!isValidEmail(email)) {
        return res.status(400).send({ status: false, message: `Please fill valid or mandatory email ` })
    }

    if (!password)
        return res.status(400).send({ status: false, message: `Please fill valid or mandatory password ` })

    let user = await userModel.findOne({ email: loginData.email });
    if (!user) {
        return res.status(404).send({ status: false, message: "User Not found" });
    }
    
    //comparing hard-coded password to the hashed password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        return res.status(400).send({ status: false, message: "wrong password" })
    }
    let token = jwt.sign({ "userId": user._id }, "productManagement", { expiresIn: '24h' });

    return res.status(200).send({ status: true, message: "login successfully", data: { userId: user._id, token: token } })
    
   } catch (err) {
       return res.status(500).send({ status: false, message: err.message })
   }
}


//********************************************************[GET USER DETAILS]*************************************************************

const getUser = async (req,res)=>{
    try
    {
       const userId = req.params.userId;
       console.log(userId)
       if(!mongoose.isValidObjectId(userId)) return res.status(400).send({msg:"userId is not Valid"});
     
       const user = await userModel.findOne({ _id: userId });
       if(!user) return res.status(404).send({status:false,msg:"user not found"});
 
     return res.status(200).send({status:true, massage: "User all Details", data: user });
       
    }
    catch(err)
    {
     res.status(500).send({status:false, massage: err.massage})
    }
 }

 
//********************************************************[update user]*************************************************************
    
const updateProfile = async function (req, res) {

        try {
      
          const data = req.body
          const userId = req.params.userId
          const files = req.files
          const update = {}
      
          const { fname, lname, email, phone, password } = data
      
          if (!isValidBody(data) && !files) {
            return res.status(400).send({status: false,message: "Please provide data in body"})
          }
      
          if (fname || fname == '') {
            if (!isValidString(fname) || !isValidUserName(fname)) {
              return res.status(400).send({ status: false, message: "fname is invalid" })
            }
            update["fname"] = fname
          }
      
          if (lname || lname == '') {
            if (!isValidString(lname) || !isValidUserName(lname)) {
              return res.status(400).send({ status: false, message: "lname is invalid" })
            }
            update["lname"] = lname; 
          }
      
          if (email || email == '') {
            if (!isValidEmail(email)) {
              return res.status(400).send({ status: false, message: "Email is invalid" })
            }
      
            let userEmail = await userModel.findOne({ email: email })
            if (userEmail) {
              return res.status(409).send({status: false,message:"This email is already registered"})
            }
            update["email"] = email;
          }
      
          if (phone || phone == '') {
            if (!isValidMobileNo(phone)) {return res.status(400).send({ status: false, message: "Phone is invalid" })
            }
      
            let userNumber = await userModel.findOne({ phone: phone })
            if (userNumber){
              return res.status(409).send({status: false,message:"This phone number already registered"})
             }
            update["phone"] = phone
          }
      
          if (password || password == '') {
            if (!isValidPassword(password)) {
              return res.status(400).send({status: false,message:"Password should be of 8 to 15 characters and it should contain one Uppercase, one lower case, Number and special character, Ex - Abhishek@12345,Qwe#121"})
            }
      
            const salt = await bcrypt.genSalt(10)
            data.password = await bcrypt.hash(data.password, salt)
      
            let encryptPassword = data.password
            update["password"] = encryptPassword
          }
      
          let address = data.address
      
          if (address || address == '') {
      
            address=JSON.parse(address)
      
            let { shipping, billing } = address
      
            if (shipping || shipping == '') {
              let { street, city, pincode } = shipping
      
              if (street || street =='') {
                if (!isValidName(address.shipping.street)) {
                  return res.status(400).send({ status: false, message: "Invalid shipping street" })
                }
                update["address.shipping.street"] = street
              }
      
              if (city || city == '') {
                if (!isValidName(address.shipping.city)) {
                  return res.status(400).send({ status: false, message: "Invalid shipping city" })
                }
                update["address.shipping.city"] = city
              }
      
              if (pincode || pincode == '') {
                if (!isValidPincode(address.shipping.pincode)) {
                  return res.status(400).send({ status: false, message: "Invalid shipping pincode" })
                }
                update["address.shipping.pincode"] = pincode
              }
            }
      
            if (billing || billing == '') {
              let { street, city, pincode } = billing;
      
              if (street || street == '') {
                if (!isValidName(address.billing.street)) {
                  return res.status(400).send({ status: false, message: "Invalid billing street" })
                }
                update["address.billing.street"] = street
              }
      
              if (city || city == '') {
                if (!isValidName(address.billing.city)) {
                  return res.status(400).send({ status: false, message: "Invalid billing city" })
                }
                update["address.billing.city"] = city
              }
      
              if (pincode || pincode == '') {
                if (!isValidpincode(address.billing.pincode)) {
                  return res.status(400).send({ status: false, message: "Invalid billing pincode" })
                }
                update["address.billing.pincode"] = pincode
              }
            }
      
            console.log(address)
          }
          
      
          if (files && files.length > 0) {
      
            if (!isValidFile(files[0].originalname)){
              return res.status(400).send({ status: false, message: `Enter format should be in jpeg/jpg/png only` })
            }
      
            let uploadedFileURL = await aws.uploadFile(files[0])
      
            update["profileImage"] = uploadedFileURL
          }
      
          else if (Object.keys(data).includes("profileImage")) {
            return res.status(400).send({ status: false, message: "please put the profileimage" });
          }
      
          const updateUser = await userModel.findOneAndUpdate(
            { _id: userId },
            {$set:update},
            { new: true }
          )
      
          return res.status(200).send({status: true,message: "user profile successfully updated",data: updateUser})
        } 
        catch (error) {
          res.status(500).send({status:false, message: error.message })
        }
      }



module.exports = {getUser,loginUser,createUser,updateProfile }

