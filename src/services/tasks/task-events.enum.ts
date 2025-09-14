export const taskEvents = {
  TASKS_CHANGED: 'tasks-changed',
} as const;

export type TaskEvent = (typeof taskEvents)[keyof typeof taskEvents];
