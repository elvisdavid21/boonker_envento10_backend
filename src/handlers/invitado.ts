import { Request, Response } from 'express'
import Invitados from '../models/invitados.model'

export const createInvitado = async (req: Request, res: Response) => {

    const invitado = await Invitados.create(req.body)
    res.json({data: invitado})
}