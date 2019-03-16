import { Model, DataTypes } from "sequelize";

export default class GuildMember extends Model {
    static init(sequelize) {
        return super.init({
            guildId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false
            },
            voiceTime: {
                type: DataTypes.BIGINT({ unsigned: true }),
                allowNull: false,
                defaultValue: 0
            },
            voiceTimerStart: DataTypes.DATE
        }, {
            timestamps: false,
            sequelize
        });
    }
}