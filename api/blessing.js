import { handleBlessing } from "./_ai.js";

export default async function blessing(req, res) {
  return handleBlessing(req, res);
}
