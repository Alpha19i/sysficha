import { connectToDatabase } from "@/app/db/mongo";

export async function ensureIndexes() {
  const db = await connectToDatabase();
  const users = db.collection("users");
  const fichas = db.collection("fichas");

  await users.createIndex({ username: 1 }, { unique: true, name: "users_username_unique" });
  await fichas.createIndex({ id: 1 }, { unique: true, name: "fichas_id_unique" });
  await fichas.createIndex({ cpf: 1 }, { name: "fichas_cpf_idx" });
  await fichas.createIndex({ servidorNome: "text" }, { name: "fichas_servidor_nome_text_idx" });
  await fichas.createIndex({ createdAt: -1 }, { name: "fichas_created_at_desc_idx" });
}
