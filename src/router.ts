import {Router} from 'express'
import sendMessage from './sendMessage/index'

const router = Router()
const multer = require('multer')
const upload = multer();
//Routing
router.post('/webhook', upload.none(), async (req, res) => {
    const formData = req.body.pretty
    try {
        await sendMessage(formData)
        res.status(200).json({ message: 'Mensaje enviado correctamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar el mensaje' })
    }
})
router.put('/', (req, res) => {
    res.json('Desde put')
})
router.patch('/', (req, res) => {
    res.json('Desde patch')
})
router.delete('/', (req, res) => {
    res.json('Desde delete')
})

export default router