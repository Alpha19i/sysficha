#!/usr/bin/env node

const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const crypto = require("node:crypto");

function parseArgs(argv) {
  const args = argv.slice(2);
  const [username, password, role = "admin"] = args;

  if (!username || !password) {
    console.error(
      "Usage: node --env-file=.env scripts/create-first-user.js <username> <password> [role]"
    );
    console.error("Roles: admin | rh | viewer");
    process.exit(1);
  }

  if (!["admin", "rh", "viewer"].includes(role)) {
    console.error("Invalid role. Use one of: admin, rh, viewer");
    process.exit(1);
  }

  return { username, password, role };
}

async function main() {
  const { username, password, role } = parseArgs(process.argv);

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error("Missing MONGODB_URI. Use .env or export the variable.");
  }

  if (!dbName) {
    throw new Error("Missing MONGODB_DB_NAME. Use .env or export the variable.");
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const users = db.collection("users");

    const existing = await users.findOne({ username });
    if (existing) {
      throw new Error(`User \"${username}\" already exists`);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      id: crypto.randomUUID(),
      username,
      passwordHash,
      role,
      active: true,
      createdAt: new Date().toISOString()
    };

    await users.insertOne(user);
    console.log(`User created: ${username} (${role})`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
