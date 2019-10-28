import loadCustomer, { Customer } from './customer';
import loadAddress, { Address } from './address';

export default sequelize => {
  loadCustomer(sequelize);
  loadAddress(sequelize);

  Customer.hasOne(Address, { foreignKey: 'customerId' });

  return sequelize;
};

export { Customer, Address };
