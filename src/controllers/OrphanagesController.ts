import { Request, Response } from 'express'

import { getRepository } from 'typeorm'
import Orphanage from '../models/Orphanage'
import OrphanageView from '../views/OrphanagesView'

import * as Yup from 'yup'

export default {
    async create(request: Request, response: Response) {

        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
        } = request.body;

        const orphanagesRepository = getRepository(Orphanage);

        const requestImages = request.files as Express.Multer.File[];

        const images = requestImages.map(image => {
            return { path: image.filename }
        })

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
            images
        }

        const schema = Yup.object().shape({
            name: Yup.string().required('Campo obrigatório'),
            latitude: Yup.number().required('Campo obrigatório'),
            longitude: Yup.number().required('Campo obrigatório'),
            about: Yup.string().required('Campo obrigatório').max(300),
            instructions: Yup.string().required('Campo obrigatório'),
            opening_hours: Yup.string().required('Campo obrigatório'),
            open_on_weekends: Yup.boolean().required('Campo obrigatório'),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required('Campo obrigatório')
                })
            )
        })

        await schema.validate(data, {
            abortEarly: false,
        })

        const orphanage = orphanagesRepository.create(data);

        await orphanagesRepository.save(orphanage);

        return response.json(OrphanageView.renderMany(orphanage));
    },

    async index(request: Request, response: Response) {
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });

        return response.json(OrphanageView.renderMany(orphanages));
    },
    async show(request: Request, response: Response) {
        const { id } = request.params

        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        });

        return response.json(OrphanageView.render(orphanage));
    }
}