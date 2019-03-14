import { Sequelize } from "sequelize";
import requireAll from "require-all";

export default async function dbinit() {
    const sequelize = new Sequelize({ dialect: "sqlite" });

    const models = loadModels(sequelize, `${__dirname}/models`);

    Object.values(models)
        .filter(model => typeof model.associate === "function")
        .forEach(model => model.associate(models));
    
    await sequelize.sync();

    return sequelize;
}

function loadModels(sequelize, dirname) {
    const models = {};
    const directory = requireAll({ dirname });
    for (const filename in directory) {
        const model = directory[filename].default || directory[filename];
        Object.assign(models, { [model.name]: model.init(sequelize) });
    }
    return models;
}