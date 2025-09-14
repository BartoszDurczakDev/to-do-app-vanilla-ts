import { mount, unmount, update } from '../../core/component-life-cycles';
import { Menu } from './../../components/molecules/menu/menu.component';
import { TaskForm } from '../../components/molecules/task-form/task-form.component';
import { TaskList } from '../../components/organisms/task-list/task-list.component';
import { taskService } from '../../services/tasks/task.service';
import { taskEvents } from '../../services/tasks/task-events.enum';
import type { IComponent } from '../../core/interfaces/component.interface';
import type { Task } from '../../models/task';

import './detail-page.css';

export class DetailPage implements IComponent {
  private tasks: Task[] = [];

  private menuHost!: HTMLElement;
  private formHost!: HTMLElement;
  private listHost!: HTMLElement;

  private handleTasksChanged: EventListener;

  constructor() {
    this.handleTasksChanged = this.onTasksChanged.bind(this);
  }

  private onTasksChanged() {
    this.tasks = taskService.getTasks();
    this.renderTaskList();
  }

  private renderTaskList() {
    update(this.listHost, new TaskList(this.tasks));
  }

  render() {
    return `
      <div class="detail-page">
        <div id="menu-host"></div>
        <div class="detail-content">
          <div id="task-form-host"></div>
          <div class="detail-task-list"></div>
        </div>
        
      </div>
    `;
  }

  afterMount(root: HTMLElement) {
    this.menuHost = root.querySelector('#menu-host')!;
    this.formHost = root.querySelector('#task-form-host')!;
    this.listHost = root.querySelector('.detail-task-list')!;

    this.tasks = taskService.getTasks();

    mount(this.menuHost, new Menu());
    mount(this.formHost, new TaskForm());
    mount(this.listHost, new TaskList(this.tasks));

    taskService.addEventListener(
      taskEvents.TASKS_CHANGED,
      this.handleTasksChanged
    );
  }

  beforeUnmount() {
    taskService.removeEventListener(
      taskEvents.TASKS_CHANGED,
      this.handleTasksChanged
    );

    unmount(this.menuHost);
    unmount(this.formHost);
    unmount(this.listHost);
  }
}
