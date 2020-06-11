const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    message: String,
    point: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true
})


const productSchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: String,
    price: Number,
    brand: String,
    quantity: Number,
    color: String,
    origin: String,
    warrenty: {
        warrentyStatus: Boolean,
        warrentyPeriod: String
    },
    manuDate: Date,
    expDate: Date,
    weight: Number,
    modelNo: String,
    image: String,
    tags: [String],
    discount: {
        discountedItem: Boolean,
        discountType: String,
        discount: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    reviews: [reviewSchema]
},
    {
        timestamps: true
    }
)



module.exports = mongoose.model('item', productSchema);