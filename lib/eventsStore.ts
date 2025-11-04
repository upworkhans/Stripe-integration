type EventRecord = { id?: string; type: string; payload: unknown; createdAt: number };

const memoryEvents: EventRecord[] = [];

export function addEvent(event: { type: string; payload: unknown }) {
  memoryEvents.unshift({ type: event.type, payload: event.payload, createdAt: Date.now() });
}

export function listEvents() {
  return memoryEvents;
}

export function clearEvents() {
  memoryEvents.length = 0;
}

