const {Schema, model, Types} = require('mongoose');// get fields from db


const schema = new Schema({  // db schema
    email: {type: String, required: true, inique: true},
    password: {type: String, required: true },
    links: [{ type: Types.ObjectId, ref: 'Link' }]   //bind id with links collection
})

module.exports = model('User',schema);