import { Task } from '../../models/task';
import { taskEvents } from './task-events.enum';

export class TaskService extends EventTarget {
  private readonly tasks: Task[] = [
    new Task(
      'SEO Optimization',
      'Please rename all images for SEO.',
      new Date(new Date().setDate(new Date().getDate() + 2))
    ),
    new Task(
      'Test for To-Do App',
      'The app has to reach 80% test coverage.',
      new Date(new Date().setDate(new Date().getDate() + 1))
    ),
  ];

  private emitChange() {
    this.dispatchEvent(new Event(taskEvents.TASKS_CHANGED));
  }

  createTask(title: string, text: string, deadline: Date) {
    const newTask = new Task(title, text, deadline);
    this.tasks.push(newTask);
    this.emitChange();
  }

  getTasks(): Task[] {
    return [...this.tasks];
  }

  getTaskById(id: number): Task | null {
    return this.tasks.find((t) => t.id === id) ?? null;
  }

  editTask(id: number, title: string, text: string, deadline: Date): boolean {
    const foundTask = this.tasks.find((t) => t.id === id);

    if (!foundTask) return false;

    foundTask.title = title;
    foundTask.text = text;
    foundTask.deadline = deadline;
    foundTask.updatedAt = new Date();

    this.emitChange();
    return true;
  }

  checkTask(id: number): boolean {
    const task = this.tasks.find((t) => t.id === id);

    if (!task) return false;

    task.checkedAt = new Date();
    this.emitChange();
    return true;
  }
}

export const taskService = new TaskService();
