import { CustomerService } from '../services';

export async function getAll(req, res, next) {
  try {
    const customers = await CustomerService.findAll(req.query.expand);
    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const customer = await CustomerService.findById(req.params.id, req.query.expand);
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const { name, address } = req.body;
    const customer = await CustomerService.create(name, address);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { name } = req.body;
    const customer = await CustomerService.update(req.params.id, name);
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    const hasBeenDeleted = await CustomerService.destroy(req.params.id);
    res.status(200).json({ deleted: hasBeenDeleted });
  } catch (error) {
    next(error);
  }
}
