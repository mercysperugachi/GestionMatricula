import {Schema, model} from 'mongoose'
import bcrypt from "bcryptjs"


const estudianteSchema = new Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    apellido:{
        type:String,
        required:true,
        trim:true
    },
    cedula:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    fecha_nacimiento: {
        type: Date,
        default: null
    },
    ciudad:{
        type:String,
        trim:true,
        default:null
    },
    direccion:{
        type:String,
        trim:true,
        default:null
    },
    telefono:{
        type:String,
        trim:true,
        default:null
    },
    email:{
        type:String,
        required:true,
        trim:true,
		unique:true
    },
    status:{
        type:Boolean,
        default:true
    },
    token:{
        type:String,
        default:null
    },
    rol:{
        type:String,
        default:"estudiante"
    }

},{
    timestamps:true
})


// Método para crear un token 
estudianteSchema.methods.createToken= function(){
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}


export default model('Estudiante',estudianteSchema)