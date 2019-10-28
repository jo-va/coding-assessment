import { ResourceNotFoundError, InternalError, BadRequestError } from '../errors';
import { Address } from '../models';
import { CustomerService } from '.';

export async function findAll() {
  try {
    return await Address.findAll();
  } catch (error) {
    throw new InternalError(error);
  }
}

export async function findById(idString) {
  let address;
  const id = Number(idString);
  if (!Number.isSafeInteger(id)) {
    throw new BadRequestError('address', idString);
  }
  try {
    address = await Address.findOne({ where: { id } });
  } catch (error) {
    throw new InternalError(error);
  }
  if (!address) {
    throw new ResourceNotFoundError('address', { id });
  }
  return address;
}

export async function findByCustomerId(idString) {
  let address;
  const customerId = Number(idString);
  if (!Number.isSafeInteger(customerId)) {
    throw new BadRequestError('address', idString);
  }
  try {
    address = await Address.findOne({ where: { customerId } });
  } catch (error) {
    throw new InternalError(error);
  }
  if (!address) {
    throw new ResourceNotFoundError('address', { customerId });
  }
  return address;
}

export async function upsertByCustomerId(idString, payload) {
  const customerId = Number(idString);
  if (!Number.isSafeInteger(customerId)) {
    throw new BadRequestError('address', idString);
  }
  // This will trow if the associated customer does not exist
  const customer = await CustomerService.findById(customerId);
  try {
    const { streetAddress, postalCode, country } = payload;
    const defaults = { streetAddress, postalCode, country, customerId };
    const address = await customer.getAddress();
    if (address) {
      const updatedAddres = await address.update(defaults);
      return [false, updatedAddres];
    } else {
      const address = await Address.create(defaults);
      customer.setAddress(address);
      return [true, address];
    }
  } catch (error) {
    throw new InternalError(error);
  }
}

export async function deleteByCustomerId(idString) {
  const customerId = Number(idString);
  if (!Number.isSafeInteger(customerId)) {
    throw new BadRequestError('address', idString);
  }
  try {
    return !!(await Address.destroy({ where: { customerId } }));
  } catch (error) {
    throw new InternalError(error);
  }
}
