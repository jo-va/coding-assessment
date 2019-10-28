import { ResourceNotFoundError, InternalError, BadRequestError } from '../errors';
import { Address, Customer } from '../models';

export async function findAll(includeAddress) {
  try {
    const include = includeAddress ? [Address] : [];
    return await Customer.findAll({ include });
  } catch (error) {
    throw new InternalError(error);
  }
}

export async function findById(idString, includeAddress) {
  let customer;
  const id = Number(idString);
  if (!Number.isSafeInteger(id)) {
    throw new BadRequestError('customer', idString);
  }
  try {
    const include = includeAddress ? [Address] : [];
    customer = await Customer.findOne({ where: { id }, include });
  } catch (error) {
    throw new InternalError(error);
  }
  if (!customer) {
    throw new ResourceNotFoundError('customer', { id });
  }
  return customer;
}

export async function create(name, address) {
  try {
    if (address) {
      const { streetAddress, postalCode, country } = address;
      return await Customer.create({ name, address: { streetAddress, postalCode, country } }, { include: [Address] });
    } else {
      return await Customer.create({ name });
    }
  } catch (error) {
    throw new InternalError(error);
  }
}

export async function update(idString, name) {
  let customer;
  const id = Number(idString);
  if (!Number.isSafeInteger(id)) {
    throw new BadRequestError('customer', idString);
  }
  try {
    customer = await Customer.findOne({ where: { id } });
  } catch (error) {
    throw new InternalError(error);
  }
  if (!customer) {
    throw new ResourceNotFoundError('customer', { id });
  }
  try {
    return await customer.update({ name });
  } catch (error) {
    throw new InternalError(error);
  }
}

export async function destroy(idString) {
  const id = Number(idString);
  if (!Number.isSafeInteger(id)) {
    throw new BadRequestError('customer', idString);
  }
  try {
    return !!(await Customer.destroy({ where: { id } }));
  } catch (error) {
    throw new InternalError(error);
  }
}
