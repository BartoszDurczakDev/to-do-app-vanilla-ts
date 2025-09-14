export class Task {
  private static counter: number = 0;

  constructor(title: string, text: string, deadline: Date) {
    Task.counter += 1;

    this.id = Task.counter;
    this.text = text;
    this.title = title;
    this.createdAt = new Date();
    this.deadline = deadline;
  }

  id: number;
  title: string;
  text: string;
  deadline: Date;
  createdAt: Date;
  checkedAt: Date | null = null;
  updatedAt: Date | null = null;
}
