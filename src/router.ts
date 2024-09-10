import {Router} from 'express'
import {sendMessage} from './sendMessage/index'
import { createInvitado } from './handlers/invitado';
import Invitados from './models/invitados.model';

const router = Router()
const multer = require('multer')
const upload = multer();
//Routing
router.post('/webhook', upload.none(), async (req, res) => {
    //const formData = 'Datos personales:Elvis David Montaluisa Toapanta, Email:elvis.latino@hotmail.com, Constructora:Los angeles, Número de teléfono:0979259075, Agenda tu visita:Friday, Aug 23, 2024 12:00 PM-02:00 PM America/Guayaquil (GMT-05:00)'
    const formData = req.body.pretty
    try {
        await sendMessage(formData)
        const saveInvitados = await createInvitado(formData)
        //console.log('save datos', saveInvitados)
        res.status(200).json({ datos: saveInvitados })
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar el mensaje' })
    }
})
router.post('/escaner', upload.none(), (req, res) => {
    const escanerData = req.body.pretty
    console.log(escanerData)
    res.json('Desde post escaner')
})
router.patch('/', (req, res) => {
    res.json('Desde patch')
})
router.get('/lista-invitados', async (req, res) => {
    try {
        const invitados = await Invitados.findAll()
        res.json({data: invitados})
    } catch (error) {
        console.log(error)
    }
})
router.delete('/', (req, res) => {
    res.json('Desde delete')
})

export default router