import { Router } from 'express'

import OrphanagesController from './controllers/OrphanagesController'

const routes = Router();

routes.get('/', (request, response) => {
    return response.json({ message: 'API Happy' })
})

routes.post('/orphanages', OrphanagesController.create)
routes.get('/orphanages', OrphanagesController.index)

export default routes