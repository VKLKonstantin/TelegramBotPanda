import { PandaData } from "./panda_wisdom_model";
import data from "./wisdom.json";

export const createCollection = () => {
    data.pandas.forEach((panda) => new PandaData(panda).save().catch((e) => console.log(e)));
}
