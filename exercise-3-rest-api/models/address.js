import { Sequelize, Model } from 'sequelize';

export class Address extends Model {}

export default sequelize => {
  Address.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      streetAddress: Sequelize.STRING,
      postalCode: Sequelize.STRING,
      country: Sequelize.STRING,
      customerId: {
        type: Sequelize.INTEGER,
        unique: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: true,
      tableName: 'Customer_Addresses',
      modelName: 'address',
    }
  );
};
