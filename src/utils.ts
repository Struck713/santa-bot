import type { Client } from "discord.js";

export const getUserByID = async (client: Client, id: string) => {
  let user = client.users.cache.get(id);
  if (!user) user = await client.users.fetch(id, { cache: true });
  return user;
}

export const random = <T>(items: T[]): [T, number] => {
  const id = Math.floor((Math.random() * items.length));
  return [items[id], id];
}
