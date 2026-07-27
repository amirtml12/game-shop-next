import mongoose, { Schema, models, model } from "mongoose";

const requirementSpecSchema = new Schema(
  {
    os: String,
    cpu: String,
    ram: String,
    gpu: String,
  },
  { _id: false }
);

const gameSchema = new Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  desc: String,
  tags: [String],
  requirements: {
    min: requirementSpecSchema,
    rec: requirementSpecSchema,
  },
});

const Game = models.Game || model("Game", gameSchema);

export default Game;