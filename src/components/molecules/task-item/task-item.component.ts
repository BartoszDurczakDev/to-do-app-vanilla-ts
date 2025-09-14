import type { IComponent } from '../../../core/interfaces/component.interface';
import { Task } from '../../../models/task';
import '../../atoms/button/button.component';
import './task-item.css';

export class TaskItem implements IComponent {
  private checkedAt: Date | null;
  private title: string;
  private text: string;
  private deadline: Date;

  private isChecked: boolean;
  private id: number;

  constructor(task: Task) {
    this.text = task.text;
    this.checkedAt = task.checkedAt;
    this.id = task.id;
    this.title = task.title;
    this.isChecked = !!this.checkedAt;
    this.deadline = task.deadline;
  }

  render() {
    return `
      <li class="task-item ${this.isChecked ? 'checked' : ''}" data-id="${
      this.id
    }">
        <input class="task-checkbox" name="is-item-checked" type="checkbox" data-id="${
          this.id
        }"
        ${this.isChecked ? 'checked disabled' : ''} />
        <div class="task-content">
          <div class="task-content__header">
            <h3 class="task-content__header__title">${this.title}</h3>
            <p class="task-content__header__deadline">Deadline: ${this.deadline.toLocaleDateString(
              'de-DE'
            )}</p>
          </div>
          <p class="task-content__text">${this.text}</p>
        </div>
        <button-el class="task-action" button-el variant="link" label="Edit"></button-el>
      </li>
    `;
  }
}
