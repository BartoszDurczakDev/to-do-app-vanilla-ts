import { jest } from '@jest/globals';

jest.unstable_mockModule('../../main', () => ({
  router: { navigateTo: jest.fn() },
}));

let TaskService: typeof import('./task.service').TaskService;
let taskService: InstanceType<typeof import('./task.service').TaskService>;

beforeAll(async () => {
  ({ TaskService: TaskService } = await import('./task.service'));
});

describe('Task Service Tests', () => {
  beforeEach(() => {
    taskService = new TaskService();
  });

  test('Creating a Task', () => {
    const initLength = taskService.getTasks().length;
    taskService.createTask('Test Task', 'This is a test task.', new Date());
    expect(taskService.getTasks().length).toBeGreaterThan(initLength);
  });

  test('Editing a Task', () => {
    const tasks = taskService.getTasks();

    const lastTask = tasks[tasks.length - 1];

    const newTitle = 'Edited Task';
    const newText = 'This is an edited task.';
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);

    taskService.editTask(lastTask.id, newTitle, newText, newDate);
    const editedTask = taskService.getTaskById(lastTask.id);

    expect(editedTask?.title).toEqual(newTitle);
    expect(editedTask?.text).toEqual(newText);
  });

  test('Checking a Task', () => {
    const tasks = taskService.getTasks();

    const lastTask = tasks[tasks.length - 1];

    taskService.checkTask(lastTask.id);
    const editedTask = taskService.getTaskById(lastTask.id);

    expect(editedTask?.checkedAt).toBeDefined();
  });
});
