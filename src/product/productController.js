const exports = require("express")
const mongoose = require("mongoose")
const productModel = require("../product/ProductModel")
const aws = require("../aws/aws")
const validation = require("../validator/validator")

//****************************************************** [Create Product] **********************************************************
const createProduct = async (req,res)=>
{
   try
   {
     let data = req.body
     let {title, description, price, currencyId, currencyFormat, isFreeShiping, style, availableSize, installments} = data

      if(!validation.isValidBody(data))
      {
        return res.status(400).send({status:false, message:"please provide data in body"})
      }

      if(!title)
      {
        return res.status(400).send({status:false, message:"title is required"})
      }
     if(!validation.isValidName(title))
     {
        return res.status(400).send({status:false, message:"title is invailed"})
     }
    
     let checkTitle = await productModel.findOne({title: title})
     if(checkTitle)
     {
      return res.status(400).send({status:false, message:"thid title is already exists"})
     }

     if(!description)
     {
      return res.status(400).send({staus:false, message:"discripion is required"})
     }
     if(!validation.isValidString(description))
     {
      return res.status(400).send({status:false, message:"description is invaild"})
     }

     if(!price)
     {
      return res.status(400).send({status:false, message:"price is required"})
     }
     if(!validation.isValidPrice(price))
      {
        return res.status(400).send({staus:false, message:"price is invaild"})
      }

      if(!currencyId)
      {
        return res.status(400).send({status:false, message:"currencyId is required"})
      }
      if(currencyId != "INR")
      {
        return res.status(400).send({status:false, message:"please provide correct currencyId"})
      }

      if(!currencyFormat)
      {
        return res.status(400).send({status:false, message:"currencyFormate is required"})
      }
      if(currencyFormat != "₹" )
      {
        return res.status(400).send({status:false, message:"please provide currect curency formet"})
      }

   }
   catch(err)
   {
     return res.status(500).send({status:false, message:err.message})
   }
}

module.exports = {createProduct}