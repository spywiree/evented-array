import mitt from "mitt";

export class EventedArray<T> extends Array<T> {
  constructor(wrap: T[] = []) {
    super(...wrap);
  }
  private emitter = mitt<{
    add: T[];
    remove: T[];
  }>();
  on = this.emitter.on;
  off = this.emitter.off;

  push(...items: T[]) {
    this.emitter.emit("add", items);
    return super.push(...items);
  }
  pop() {
    const result = super.pop();
    if (result !== undefined) {
      this.emitter.emit("remove", [result]);
    }
    return result;
  }
  shift() {
    const result = super.shift();
    if (result !== undefined) {
      this.emitter.emit("remove", [result]);
    }
    return result;
  }
  unshift(...items: T[]) {
    this.emitter.emit("add", items);
    return super.unshift(...items);
  }
  splice(start: number, deleteCount?: number): T[];
  splice(start: number, deleteCount: number, ...items: T[]): T[];
  splice(start: number, deleteCount?: number, ...items: T[]): T[] {
    let result = [] as T[];
    if (deleteCount !== undefined && items.length > 0) {
      result = super.splice(start, deleteCount, ...items);
      this.emitter.emit("add", items);
    } else {
      result = super.splice(start, deleteCount);
    }

    this.emitter.emit("remove", result);
    return result;
  }
}
