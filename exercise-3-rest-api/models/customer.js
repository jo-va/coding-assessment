import { Sequelize, Model } from 'sequelize';

export class Customer extends Model {}

export default sequelize => {
  Customer.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.STRING,
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      tableName: 'Customers',
      modelName: 'customer',
    }
  );
};
