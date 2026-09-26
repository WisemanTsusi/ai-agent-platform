import { Message } from "../types";

export interface MemoryStore {
  append(sessionId: string, message: Message): Promise<void>;
  get(sessionId: string): Promise<Message[]>;
  clear(sessionId: string): Promise<void>;
}

export class InMemoryStore implements MemoryStore {
  private readonly sessions = new Map<string, Message[]>();

  async append(sessionId: string, message: Message): Promise<void> {
    const messages = this.sessions.get(sessionId) ?? [];
    messages.push(message);
    this.sessions.set(sessionId, messages);
  }

  async get(sessionId: string): Promise<Message[]> {
    return [...(this.sessions.get(sessionId) ?? [])];
  }

  async clear(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }
}
