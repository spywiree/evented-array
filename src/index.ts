import mitt from "mitt";

export class EventedArray<T> extends Array<T> {
  constructor(wrap: T[] = []) {
    super(...wrap);
  }
  private emitter = mitt<{
    add: T;
    remove: T;
  }>();
  on = this.emitter.on;
  off = this.emitter.off;

  push(...items: T[]) {
    const result = super.push(...items);
    for (const item of items) {
      this.emitter.emit("add", item);
    }
    return result;
  }
  pop() {
    const result = super.pop();
    if (result !== undefined) {
      this.emitter.emit("remove", result);
    }
    return result;
  }
  shift() {
    const result = super.shift();
    if (result !== undefined) {
      this.emitter.emit("remove", result);
    }
    return result;
  }
  unshift(...items: T[]) {
    const result = super.unshift(...items);
    for (const item of items) {
      this.emitter.emit("add", item);
    }
    return result;
  }
  splice(start: number, deleteCount?: number): T[];
  splice(start: number, deleteCount: number, ...items: T[]): T[];
  splice(start: number, deleteCount?: number, ...items: T[]): T[] {
    let result = [] as T[];
    if (deleteCount !== undefined && items.length > 0) {
      result = super.splice(start, deleteCount, ...items);
      for (const item of items) {
        this.emitter.emit("add", item);
      }
    } else {
      result = super.splice(start, deleteCount);
    }

    for (const item of result) {
      this.emitter.emit("remove", item);
    }
    return result;
  }
}
