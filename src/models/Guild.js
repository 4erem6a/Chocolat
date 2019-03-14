import { Model, DataTypes } from "sequelize";

export default class Guild extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            prefix: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: process.env.PREFIX
            }
        }, {
            timestamps: false,
            sequelize
        });
    }
}