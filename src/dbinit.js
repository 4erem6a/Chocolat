import { Sequelize } from "sequelize";
import requireAll from "require-all";

export default async function dbinit() {
    const sequelize = process.env.NODE_ENV == "development"
        ? new Sequelize({ dialect: "sqlite" })
        : new Sequelize(process.env.DATABASE_URL, { dialect: "postgres" });

    loadModels(sequelize, `${__dirname}/models`);
    
    await sequelize.sync();

    return sequelize;
}

function loadModels(sequelize, dirname) {
    Object.values(requireAll({ dirname }))
        .map(model => model.default || model)
        .map(model => model.init(sequelize))
        .filter(model => typeof model.associate === "function")
        .forEach((model, i, models) => model.associate(models));
}