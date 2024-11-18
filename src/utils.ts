import type { Client } from "discord.js";

export const getUserByID = async (client: Client, id: string) => {
  let user = client.users.cache.get(id);
  if (!user) user = await client.users.fetch(id, { cache: true });
  return user;
}

export const random = <T>(items: T[], ignored: T[] = []): [T, number] => {
  while (true) {
    const id = Math.floor((Math.random() * items.length));
    if (!ignored.includes(items[id])) return [items[id], id];
  }
}
