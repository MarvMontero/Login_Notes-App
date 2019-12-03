const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcryptjs'); //this have a module that allow us to bcrypt passwords

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

//it creates methods
UserSchema.methods.encryptPassword = async (password) =>{
  const salt = await bcrypt.genSalt(10); //for generate a hash
  const hash = await bcrypt.hash(password, salt); //password bcypt
  return hash;
};

UserSchema.methods.matchPassword = async function (password) { //not use arrow function because not allow me to get a property from UserSchema.
    return await bcrypt.compare(password, this.password); //return true or false
};

module.exports = mongoose.model('User', UserSchema);