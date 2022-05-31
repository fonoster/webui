export class Storage {
  public constructor(private readonly key: string) {}

  public get() {
    return localStorage.getItem(this.key)
  }

  public destroy(): void {
    localStorage.removeItem(this.key)
  }

  public set(value: string) {
    localStorage.setItem(this.key, value)
  }
}
