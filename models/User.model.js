import moongoese from 'mongoose'
const userschema = moongoese.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },refreshtoken:{
         type: String,
    }
})
const user=moongoese.model('user',userschema);
export default user