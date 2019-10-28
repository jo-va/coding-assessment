import { Router } from 'express';
import installCustomerRoutes from './customer';
import installAddressRoutes from './address';

export default () => {
  const app = Router();

  app.get('/', (_req, res) => {
    res.status(200).json({ message: 'Customers API v1' });
  });

  installCustomerRoutes(app);
  installAddressRoutes(app);

  return app;
};
