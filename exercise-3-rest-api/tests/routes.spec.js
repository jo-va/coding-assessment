import request from 'supertest';
import { startServer } from '../index';
import { Customer, Address } from '../models';

describe('Endpoints', () => {
  let app;
  let unloadApp;
  const apiPrefix = '/api';

  beforeAll(async () => {
    [app, unloadApp] = await startServer();
  });

  afterAll(async () => {
    if (unloadApp) {
      await unloadApp();
    }
  });

  const customer1 = { name: 'Jo' };
  const customer2 = { name: 'Denis' };
  const address1 = { streetAddress: '123, XYZ street', postalCode: 'XYZ', country: 'ZZ' };
  const address2 = { streetAddress: '456, Keith road' };
  let customer1DAO, customer2DAO;
  let address1DAO, address2DAO;

  async function initDatabase() {
    await Address.sync({ force: true });
    await Customer.sync({ force: true });
    customer1DAO = await Customer.create(customer1);
    customer2DAO = await Customer.create(customer2);
    address1DAO = await Address.create(address1);
    address2DAO = await Address.create(address2);
    await customer1DAO.setAddress(address1DAO);
    await customer2DAO.setAddress(address2DAO);
  }

  beforeEach(async () => {
    await initDatabase();
  });

  describe('API information', () => {
    it('should return the API name and version', async () => {
      const res = await request(app).get(`${apiPrefix}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Customers API v1' });
    });
  });

  describe('Customer Endpoints', () => {
    describe('GET /api/customers', () => {
      it('should return all customers', async () => {
        const res = await request(app).get(`${apiPrefix}/customers`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body).toMatchObject([customer1, customer2]);
      });

      it('should return all customers and include their address', async () => {
        const res = await request(app).get(`${apiPrefix}/customers?expand=true`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body).toMatchObject([
          { ...customer1, address: address1 },
          { ...customer2, address: { ...address2, postalCode: null, country: null } },
        ]);
      });
    });

    describe('POST /api/customers', () => {
      it('should create a customer', async () => {
        const customer = { name: 'Paul' };
        const res = await request(app)
          .post(`${apiPrefix}/customers`)
          .send(customer);
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject(customer);
      });

      it('should create a customer and its address', async () => {
        const customer = {
          name: 'Simon',
          address: { streetAddress: '123, Hawai', country: 'USA', postalCode: '123456' },
        };
        const res = await request(app)
          .post(`${apiPrefix}/customers`)
          .send(customer);
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject(customer);
      });

      it('should only consider valid properties when creating a customer/address', async () => {
        const address = { streetAddress: '456, Les grandes fourches', country: 'FR' };
        const customer = { name: 'Jack' };
        const customerWithInvalidProps = {
          ...customer,
          someBadProp: 123,
          address: { ...address, anotherBadProp: 'hello' },
        };
        const res = await request(app)
          .post(`${apiPrefix}/customers`)
          .send(customerWithInvalidProps);
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({ ...customer, address });
      });
    });

    describe('GET /api/customers/:id', () => {
      it('should return a customer by id', async () => {
        const res = await request(app).get(`${apiPrefix}/customers/${customer1DAO.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({ ...customer1 });
        expect(res.body).not.toMatchObject({ address: address1 });
      });

      it('should return a customer by id and include its address', async () => {
        const res = await request(app).get(`${apiPrefix}/customers/${customer1DAO.id}?expand=true`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({ ...customer1, address: address1 });
      });

      it('should return a 400 Bad Request error if the id is not numeric', async () => {
        const res = await request(app).get(`${apiPrefix}/customers/badId`);
        expect(res.statusCode).toBe(400);
      });

      it('should return a 404 Not Found error if the id is not valid', async () => {
        const res = await request(app).get(`${apiPrefix}/customers/9999`);
        expect(res.statusCode).toBe(404);
      });
    });

    describe('PUT /api/customers/:id', () => {
      let customerDAO;
      const customer = { name: 'Betrand' };

      beforeEach(async () => {
        customerDAO = await Customer.create(customer);
      });

      afterAll(async () => {
        await customerDAO.destroy();
      });

      it('should update a customer by id', async () => {
        let res = await request(app).get(`${apiPrefix}/customers/${customerDAO.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject(customer);

        res = await request(app)
          .put(`${apiPrefix}/customers/${customerDAO.id}`)
          .send({ name: 'Bob' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({ name: 'Bob' });
      });

      it('should return a 400 Bad Request error if the id is not numeric', async () => {
        const res = await request(app).put(`${apiPrefix}/customers/badId`);
        expect(res.statusCode).toBe(400);
      });

      it('should return a 404 Not Found error if the id is not valid', async () => {
        const res = await request(app).put(`${apiPrefix}/customers/9999`);
        expect(res.statusCode).toBe(404);
      });
    });

    describe('DELETE /api/customers/:id', () => {
      let customerDAO;
      const customer = { name: 'Betrand' };

      beforeEach(async () => {
        customerDAO = await Customer.create(customer);
      });

      afterAll(async () => {
        await customerDAO.destroy();
      });

      it('should delete an existing customer by id', async () => {
        let res = await request(app).delete(`${apiPrefix}/customers/${customerDAO.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ deleted: true });

        res = await request(app).delete(`${apiPrefix}/customers/${customerDAO.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ deleted: false });
      });

      it('should not fail when trying to delete a non-existing customer', async () => {
        const res = await request(app).delete(`${apiPrefix}/customers/9999`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ deleted: false });
      });

      it('should return a 400 Bad Request error if the id is not numeric', async () => {
        const res = await request(app).delete(`${apiPrefix}/customers/badId`);
        expect(res.statusCode).toBe(400);
      });
    });
  });

  describe('Address Endpoints', () => {
    const customer3 = { name: 'Daniel' };
    const address3 = { streetAddress: '487, Hamilton road', country: 'USA' };
    let customer3DAO;

    async function initDatabase() {
      customer3DAO = await Customer.create(customer3);
    }

    beforeEach(async () => {
      await initDatabase();
    });

    describe('GET /api/customer-addresses', () => {
      it('should return all customer addresses', async () => {
        const res = await request(app).get(`${apiPrefix}/customer-addresses`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body).toMatchObject([address1, address2]);
      });
    });

    describe('GET /api/customer-addresses/:id', () => {
      it('should return an address by id', async () => {
        const res = await request(app).get(`${apiPrefix}/customer-addresses/${address1DAO.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject(address1);
      });

      it('should return a 400 Bad Request error if the id is not numeric', async () => {
        const res = await request(app).get(`${apiPrefix}/customer-addresses/badId`);
        expect(res.statusCode).toBe(400);
      });

      it('should return a 404 Not Found error if the id is not valid', async () => {
        const res = await request(app).get(`${apiPrefix}/customer-addresses/9999`);
        expect(res.statusCode).toBe(404);
      });
    });

    describe('GET /api/customers/:id/address', () => {
      it('should return the address associated to a customer', async () => {
        const res = await request(app).get(`${apiPrefix}/customers/${customer1DAO.id}/address`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject(address1);
      });

      it('should return a 400 Bad Request error if the id is not numeric', async () => {
        const res = await request(app).get(`${apiPrefix}/customers/badId/address`);
        expect(res.statusCode).toBe(400);
      });

      it('should return a 404 Not Found error if the id is not valid', async () => {
        const res = await request(app).get(`${apiPrefix}/customers/9999/address`);
        expect(res.statusCode).toBe(404);
      });
    });

    describe('PUT /api/customers/:id/address', () => {
      it('should create an address if the customer has no address', async () => {
        const res = await request(app)
          .put(`${apiPrefix}/customers/${customer3DAO.id}/address`)
          .send(address3);
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject(address3);
      });

      it('should update the address if the customer already has an address', async () => {
        const res = await request(app)
          .put(`${apiPrefix}/customers/${customer1DAO.id}/address`)
          .send(address3);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject(address3);
      });

      it('should return a 400 Bad Request error if the id is not numeric', async () => {
        const res = await request(app).put(`${apiPrefix}/customers/badId/address`);
        expect(res.statusCode).toBe(400);
      });

      it('should return a 404 Not Found error if the id is not valid', async () => {
        const res = await request(app).put(`${apiPrefix}/customers/9999/address`);
        expect(res.statusCode).toBe(404);
      });
    });

    describe('DELETE /api/customers/:id/address', () => {
      it('should delete the address associated to a customer', async () => {
        let res = await request(app).delete(`${apiPrefix}/customers/${customer1DAO.id}/address`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ deleted: true });

        res = await request(app).delete(`${apiPrefix}/customers/${customer1DAO.id}/address`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ deleted: false });
      });

      it('should return a 400 Bad Request error if the id is not numeric', async () => {
        const res = await request(app).delete(`${apiPrefix}/customers/badId/address`);
        expect(res.statusCode).toBe(400);
      });

      it('should not fail if the address does not exist', async () => {
        const res = await request(app).delete(`${apiPrefix}/customers/9999/address`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ deleted: false });
      });
    });
  });
});
