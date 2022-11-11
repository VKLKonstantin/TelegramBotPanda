
import { Schema, model } from 'mongoose';

export interface PandaResponse {
  id: string;
  description: string;
  picture: string;
}

const PandaSchema = new Schema({
  id: { type: String },
  description: { type: String },
  picture: { type: String }
})

export const PandaData = model('pandaModel', PandaSchema)

const _getAllPandas = async (): Promise<PandaResponse[]> => (
  PandaData.find()
);
export const getAllPandas = () => _getAllPandas();