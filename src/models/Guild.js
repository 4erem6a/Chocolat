import { Model, DataTypes } from "sequelize";

import { defaults } from "../../config";

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
                defaultValue: defaults.prefix
            },
            locale: DataTypes.STRING
        }, {
            timestamps: false,
            sequelize
        });
    }
}