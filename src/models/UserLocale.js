import { Model, DataTypes } from "sequelize";

export default class UserLocale extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            locale: DataTypes.STRING,
            overrideGuildLocale: DataTypes.BOOLEAN
        }, {
            timestamps: false,
            sequelize
        });
    }
}