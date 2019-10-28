import { Router } from 'express';
import { addressController, customerController } from '../controllers';
import { MethodNotAllowedError } from '../errors';

const router = Router();

export default app => {
  app.use('/customers', router);

  // Access all customers and create a new customer
  router
    .route('/')
    .get(customerController.getAll) // can get adddress
    .post(customerController.create) // can create address
    .all(() => {
      throw new MethodNotAllowedError();
    });

  // Access/modify a customers by id
  router
    .route('/:id')
    .get(customerController.getById) // can get address
    .put(customerController.update) // can update address
    .delete(customerController.destroy) // delete customer and address
    .all(() => {
      throw new MethodNotAllowedError();
    });

  // Access/modify the address associated to a customer
  router
    .route('/:id/address')
    .get(addressController.getByCustomerId)
    .put(addressController.updateOrCreateByCustomerId)
    .delete(addressController.deleteByCustomerId)
    .all(() => {
      throw new MethodNotAllowedError();
    });
};
