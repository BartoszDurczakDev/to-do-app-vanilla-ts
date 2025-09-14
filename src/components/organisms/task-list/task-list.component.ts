import type { IComponent } from '../../../core/interfaces/component.interface';
import type { Task } from '../../../models/task';
import { taskService } from '../../../services/tasks/task.service';
import { TaskItem } from '../../molecules/task-item/task-item.component';
import type { TaskFilter } from './task-filter.type';
import './task-list.css';

export class TaskList implements IComponent {
  private containerEl?: HTMLElement;
  private listEl?: HTMLUListElement;
  private selectFilterEl?: HTMLSelectElement;

  private onCheckboxChanged!: EventListener;
  private onTaskEditClicked!: EventListener;
  private onSelectFilterChanged!: EventListener;

  private allTask: Task[];
  private tasksFiltered: Task[] = [];
  private selectedFilter: TaskFilter = 'all';

  constructor(tasks: Task[]) {
    this.allTask = [...tasks];
  }

  renderTaskList() {
    switch (this.selectedFilter) {
      case 'all':
        this.tasksFiltered = this.allTask;
        break;
      case 'checked':
        this.tasksFiltered = this.allTask.filter((t) => !!t.checkedAt);
        break;
      case 'unchecked':
        this.tasksFiltered = this.allTask.filter((t) => !t.checkedAt);
        break;
      default:
        this.tasksFiltered = this.allTask;
        break;
    }

    return this.tasksFiltered
      .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
      .map((t) => new TaskItem(t).render())
      .join('');
  }

  private handleCheckboxChange(e: Event) {
    const checkbox = (e.target as Element).closest<HTMLInputElement>(
      '.task-checkbox'
    );
    if (!checkbox) return;

    const id = Number(checkbox.dataset.id);

    if (!Number.isFinite(id)) return;

    taskService.checkTask(id);
    checkbox.disabled = true;
  }

  private handleTaskEdit(e: Event) {
    const btn = (e.target as Element).closest<HTMLElement>('.task-action');

    if (!btn) return;

    const li = btn.closest<HTMLElement>('.task-item');

    const id = Number(li?.dataset.id);

    if (!Number.isFinite(id)) return;

    const foundTask = taskService.getTaskById(id);
    if (!foundTask) return;

    (li ?? this.containerEl)!.dispatchEvent(
      new CustomEvent('task-edit', {
        bubbles: true,
        detail: foundTask,
      })
    );
  }

  private selectFilterChanged(e: Event) {
    e.preventDefault();
    this.selectedFilter = (e.target as HTMLSelectElement).value as TaskFilter;

    if (!this.listEl) return;

    this.listEl.innerHTML = this.renderTaskList();
  }

  assignElements(root: HTMLElement) {
    this.containerEl = root.querySelector('.task-list-container') ?? root;
    this.listEl =
      (root.querySelector('ul.task-list') as HTMLUListElement | null) ||
      undefined;
    this.selectFilterEl =
      root.querySelector<HTMLSelectElement>('.task-filter') ?? undefined;
  }

  afterMount(root: HTMLElement) {
    this.assignElements(root);

    if (!this.containerEl || !this.listEl || !this.selectFilterEl) return;

    this.onCheckboxChanged = this.handleCheckboxChange.bind(this);
    this.listEl.addEventListener('change', this.onCheckboxChanged);

    this.onTaskEditClicked = this.handleTaskEdit.bind(this);
    this.containerEl.addEventListener('click', this.onTaskEditClicked);

    this.onSelectFilterChanged = this.selectFilterChanged.bind(this);
    this.selectFilterEl?.addEventListener('change', this.onSelectFilterChanged);
  }

  beforeUnmount() {
    this.listEl?.removeEventListener('change', this.onCheckboxChanged);

    this.containerEl?.removeEventListener('click', this.onTaskEditClicked);

    this.selectFilterEl?.removeEventListener(
      'change',
      this.onSelectFilterChanged
    );
  }

  render() {
    return `
      <div class="task-list-container">
        <h2>Tasks</h2>
        <div class="task-list-filters">
           <label>
             Filter:
           </label>
            <select class="task-filter">
              <option value="all">All</option>
              <option value="unchecked">Open</option>
              <option value="checked">Done</option>
            </select>
        </div>
        <ul class="task-list">
          ${this.renderTaskList()}
        </ul>
      </div>
    `;
  }
}
