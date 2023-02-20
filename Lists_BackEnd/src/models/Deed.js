const { default: mongoose } = require('mongoose')

const Schema = require('mongoose').Schema

const deedSchema = new Schema({
    text: {
        type: String,
        required: true,
        unique: true
    },
    important: {
        type: Boolean,
        required: true
    },
    date: {
    },
    details: {
        type: String,
    }
},
{
    timestamps: true
}
)
deedSchema.virtual('id').get(function() {
    return this._id.toHexString();
  }).set(function(id) {
    this._id = id;
  });
  
deedSchema.set('toJSON', {
    virtuals: true
  });


module.exports = mongoose.model('Deed', deedSchema)