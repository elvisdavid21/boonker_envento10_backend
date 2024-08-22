import express from 'express'
import router from './router'
import db from './config/db'
import colors from 'colors'
import cors, {CorsOptions} from 'cors'


//conexion base de datos
async function connectBD() {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.bgGreen.bold('Conexion exitosa a la BD'))
    } catch (error) {
        console.log(error)
        console.log(colors.bgRed('Error al conectar a la BD'))
    }
}
//connectBD()

//instancia de express
const server = express()
//habilitar cors
// const corsOptions: CorsOptions = {
//     origin: function(origin, callback) {
//         if(origin === process.env.FRONTEND_URL){
//             callback(null, true)
//         }else{
//             callback(new Error('Error de cors'))
//         }
//     }
// }
//server.use(cors(corsOptions))
//server.use(bodyParser.json())

//leer datos de formularios
const bodyParser = require('body-parser');

server.use(bodyParser.json())

server.use(bodyParser.urlencoded({ extended: true }));

server.use('/api/invitados', router)

export default server