const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },    
    favourites: {
        type: [Schema.Types.ObjectId],
        ref: 'Recipe'
    }
}, { timestamps: true });

// password encryption before saving new user
UserSchema.pre('save', function(next) {
    // if password field in schema is not modified
    if(!this.isModified) {
        return next();
    }
    // generate salt
    bcrypt.genSalt(10, (err, salt) => {
        if(err) return next(err);
        // hash password and store in password filed
        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) return next(err);
            // set password equal to hashedpassword
            this.password = hash;
            next();
        });
    })
})

module.exports = mongoose.model('User', UserSchema);