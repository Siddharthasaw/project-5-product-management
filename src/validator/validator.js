//<---------------------------Validations : String----------------------------->//
const isValidString = function (value) {
    if (typeof value === undefined || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false  
    return true
}

//<---------------------------Validations : Mobile Number----------------------------->//
const isValidMobileNo=function(mobile){
  const regexMob=/[6-9]{1}[0-9]{9}/
  return regexMob.test(mobile)
}

//<---------------------------Validations : Email----------------------------->//
const isValidEmail=function(email){
  const regexEmail=/[a-zA-Z_1-90]{3,}@[A-za-z]{3,}[.]{1}[a-zA-Z]{2,}/
  return regexEmail.test(email)
}

//<---------------------------Validations : Password----------------------------->//
const isValidPassword = function (password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/
  return passwordRegex.test(password);
}

const isValidpincode = function (pincode) {
  const reg = /^[0-9]{6}$/;
  return reg.test(String(pincode));
};

const isValidDate = function(date){
  let regexDate = /^^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
  return regexDate.test(date)
}

const isValidBody = (data)=> {
  return Object.keys(data).length > 0;
}


const isValidFile = (img) => {
  const regex = /(\/*\.(?:png|gif|webp|jpeg|jpg))/.test(img)
  return regex
}
const isValidName = function (name) {
  if (/^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/.test(name)) return true
  return false
}

const isValidUserName = function (name) {
  if (/^([a-zA-Z]+\s)*[a-zA-Z]+.{2,15}$/.test(name)) return true;
  return false;
}


const isValidAvailableSizes = (availablesizes) => {
  for( i=0 ;i<availablesizes.length; i++){
    if(!["S", "XS","M","X", "L","XXL", "XL"].includes(availablesizes[i])) return false
  }
  return true
}

const isValidPrice = (value) => {
  const regEx =/^[1-9]\d{0,8}(?:\.\d{1,2})?$/
  const result = regEx.test(value)
  return result
}

module.exports = { isValidString , isValidMobileNo ,isValidPrice ,isValidEmail , isValidPassword , isValidpincode , isValidDate ,isValidBody,isValidFile,isValidName,isValidUserName,isValidAvailableSizes}