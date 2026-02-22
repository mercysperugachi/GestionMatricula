import {Schema, model} from 'mongoose'

const materiaSchema = new Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    codigo:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    descripcion:{  
        type:String,
        trim:true,
        default:null
    },
    creditos:{  
        type:Number,
        default:null
    },
    status:{        
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

export default model("Materia",materiaSchema)