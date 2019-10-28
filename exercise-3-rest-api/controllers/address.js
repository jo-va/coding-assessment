import { AddressService } from '../services';

export async function getAll(_req, res, next) {
  try {
    const addresses = await AddressService.findAll();
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const address = await AddressService.findById(req.params.id);
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
}

export async function getByCustomerId(req, res, next) {
  try {
    const address = await AddressService.findByCustomerId(req.params.id);
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
}

export async function updateOrCreateByCustomerId(req, res, next) {
  try {
    const [created, address] = await AddressService.upsertByCustomerId(req.params.id, req.body);
    res.status(created ? 201 : 200).send(address);
  } catch (error) {
    next(error);
  }
}

export async function deleteByCustomerId(req, res, next) {
  try {
    const deleted = await AddressService.deleteByCustomerId(req.params.id);
    res.status(200).json({ deleted });
  } catch (error) {
    next(error);
  }
}
