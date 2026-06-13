import { handleReading } from "./_ai.js";

export default async function reading(req, res) {
  return handleReading(req, res);
}
