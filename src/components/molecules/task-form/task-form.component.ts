import type { IComponent } from '../../../core/interfaces/component.interface';
import type { Task } from '../../../models/task';
import { taskService } from '../../../services/tasks/task.service';
import './task-form.css';

export class TaskForm implements IComponent {
  private handleSubmit: EventListener;
  private handleDescInput: EventListener;
  private handleTitleInput: EventListener;
  private handleEditTask: EventListener;

  private readonly maxDescriptionSize: number = 300;
  private readonly maxTitleSize: number = 100;

  private formEl?: HTMLFormElement;
  private titleEl?: HTMLInputElement;
  private descriptionEl?: HTMLTextAreaElement;
  private titleCounterEl?: HTMLSpanElement;
  private descriptionCounterEl?: HTMLSpanElement;
  private deadlineEl?: HTMLInputElement;

  private isEditModeActive: boolean = false;
  private taskIdToEdit: number | null = null;

  constructor() {
    this.handleSubmit = this.onFormSubmitted.bind(this);
    this.handleDescInput = this.onDescriptionLengthChanged.bind(this);
    this.handleTitleInput = this.onTitleLengthChanged.bind(this);
    this.handleEditTask = this.onEditTask.bind(this);
  }

  private onTitleLengthChanged(e: Event) {
    const el = e.currentTarget as HTMLInputElement;
    this.updateTitleCounter(el.value.length);
  }

  private onDescriptionLengthChanged(e: Event) {
    const el = e.currentTarget as HTMLTextAreaElement;
    this.updateDescCounter(el.value.length);
  }

  private updateTitleCounter(len: number) {
    if (this.titleCounterEl) this.titleCounterEl.textContent = String(len);
  }

  private updateDescCounter(len: number) {
    if (this.descriptionCounterEl)
      this.descriptionCounterEl.textContent = String(len);
  }

  private onEditTask(e: Event) {
    const { id, title, text, deadline } = (e as CustomEvent<Task>).detail;

    this.isEditModeActive = true;
    this.taskIdToEdit = id;

    if (this.titleEl) this.titleEl.value = title;
    if (this.descriptionEl) this.descriptionEl.value = text;
    if (this.deadlineEl) {
      const deadlineValue =
        deadline instanceof Date
          ? new Date(
              deadline.getFullYear(),
              deadline.getMonth(),
              deadline.getDate()
            )
              .toISOString()
              .slice(0, 10)
          : String(deadline);
      this.deadlineEl.value = deadlineValue;
    }

    this.updateTitleCounter(title.length);
    this.updateDescCounter(text.length);

    const btn = document.getElementById(
      'task-form-submit-btn'
    ) as HTMLInputElement | null;

    if (btn) btn.value = 'Edit Task';
  }

  private onFormSubmitted(e: Event) {
    e.preventDefault();
    if (!this.formEl) return;

    const title = (
      this.formEl.elements.namedItem('title') as HTMLInputElement
    )?.value.trim();

    const description = (
      this.formEl.elements.namedItem('description') as HTMLTextAreaElement
    )?.value.trim();

    const deadline = (
      this.formEl.elements.namedItem('deadline') as HTMLInputElement
    )?.value;

    if (!title || !description || !deadline) return;

    const [y, m, d] = deadline.split('-').map(Number);
    const deadlineDate = new Date(y, m - 1, d);

    this.isEditModeActive
      ? taskService.editTask(
          this.taskIdToEdit!,
          title,
          description,
          deadlineDate
        )
      : taskService.createTask(title, description, deadlineDate);

    this.formEl.dispatchEvent(
      new CustomEvent('task-submit', {
        bubbles: true,
        composed: true,
        detail: { title, text: description },
      })
    );

    this.updateTitleCounter(0);
    this.updateDescCounter(0);

    this.isEditModeActive = false;
    this.taskIdToEdit = null;
    this.formEl.reset();

    const btn = document.getElementById(
      'task-form-submit-btn'
    ) as HTMLInputElement | null;
    if (btn) btn.value = 'Add Task';
  }

  assignElements(root: HTMLElement): void {
    this.formEl =
      root.querySelector<HTMLFormElement>('.task-form') ?? undefined;

    this.titleEl = root.querySelector<HTMLInputElement>('#title') ?? undefined;

    this.descriptionEl =
      root.querySelector<HTMLTextAreaElement>('#description') ?? undefined;

    this.deadlineEl =
      root.querySelector<HTMLInputElement>('#deadline-input') ?? undefined;

    this.titleCounterEl =
      root.querySelector<HTMLSpanElement>('#title-length-counter') ?? undefined;
    this.descriptionCounterEl =
      root.querySelector<HTMLSpanElement>('#description-length-counter') ??
      undefined;
  }

  afterMount(root: HTMLElement) {
    this.assignElements(root);

    this.updateTitleCounter(this.titleEl?.value.length ?? 0);
    this.updateDescCounter(this.descriptionEl?.value.length ?? 0);

    document.addEventListener('task-edit', this.handleEditTask);
    this.formEl?.addEventListener('submit', this.handleSubmit);
    this.titleEl?.addEventListener('input', this.handleTitleInput);
    this.descriptionEl?.addEventListener('input', this.handleDescInput);
  }

  beforeUnmount() {
    this.formEl?.removeEventListener('submit', this.handleSubmit);
    this.titleEl?.removeEventListener('input', this.handleTitleInput);
    this.descriptionEl?.removeEventListener('input', this.handleDescInput);
    document.removeEventListener('task-edit', this.handleEditTask);
  }

  render() {
    return `
      <div class="task-form-wrapper">
        <h2>${this.isEditModeActive ? 'Edit task' : 'Add a new task'}</h2>
        <form id="title-input" class="task-form">
          <div class="form-group">
            <label for="title">Titel</label>
              <input id="title" name="title" placeholder="Titel..." type="text" maxlength="${
                this.maxTitleSize
              }" required />
              <p class="length-counter">
                <span id="title-length-counter">0</span>/${this.maxTitleSize}
              </p>
          </div>
          <div class="form-group">
            <label for="deadline">Deadline</label>
            <input id="deadline-input" name="deadline" type="date"required />
          </div>

          <div id="description-input" class="form-group">
            <label for="description">Description</label>
              <textarea id="description" name="description" placeholder="Describe the task..."
                    maxlength="${this.maxDescriptionSize}" 
              required rows="2"></textarea>
              <p class="length-counter">
                <span id="description-length-counter">0</span>/${
                  this.maxDescriptionSize
                }
              </p>
          </div>
          <input id="task-form-submit-btn" type="submit" value="${
            this.isEditModeActive ? 'Save' : 'Add Task'
          }"/>
        </form>
      </div>
    `;
  }
}
