import { Router } from 'express';
import { addressController } from '../controllers';
import { MethodNotAllowedError } from '../errors';

const router = Router();

export default app => {
  app.use('/customer-addresses', router);

  // Address creation/update/deletion is handled on the /customers/:id/address route

  // Get all addresses
  router
    .route('/')
    .get(addressController.getAll)
    .all(() => {
      throw new MethodNotAllowedError();
    });

  // Get an address by id
  router
    .route('/:id')
    .get(addressController.getById)
    .all(() => {
      throw new MethodNotAllowedError();
    });
};
