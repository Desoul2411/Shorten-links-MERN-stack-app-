const {Schema, model, Types} = require('mongoose');// get fields from db


const schema = new Schema({  // db schema
    from : {type: String, required: true},
    to: {type: String, required: true, unique: true}, // link that will be generated
    code: {type: String, required: true, unique: true},
    date: {type: Date, default: Date.now},
    clicks: {type: Number, default: 0}, // number of clicks on the link (for analytics)
    owner: {type: Types.ObjectId, ref: 'User'} // to tie this model with User model

})

module.exports = model('Link',schema);