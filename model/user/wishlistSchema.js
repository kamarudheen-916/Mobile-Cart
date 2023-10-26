const mongoose = require('mongoose');

const WishListSchema = new mongoose.Schema({
    User_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // Reference to the User model
    Products: [{
       Product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }, // Reference to the Product model
    }],
});

const wishlist = mongoose.model('Wishlist', WishListSchema);
module.exports = wishlist;
