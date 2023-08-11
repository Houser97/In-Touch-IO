const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    pictureUrl: {type: String, default: ""},
    publicId: {type: String},
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

module.exports = mongoose.model("User", UserSchema);


// Definir la referencia después de definir el modelo User
UserSchema.virtual('friendList', {
    ref: 'User', // Modelo al que estás haciendo referencia
    localField: '_id', // Campo local en User (ID del usuario)
    foreignField: 'friends', // Campo en el modelo referenciado que corresponde a friends
    justOne: false // Puede haber múltiples amigos, no solo uno
});