export class Ship {
  length: number;
  hits: number;
  id: number;

  constructor(length: number, id: number) {
    this.length = length;
    this.id = id;
    this.hits = 0;
  }

  makeDamage(): number | null {
    this.hits += 1;

    if (this.hits === this.length) {
      return this.id;
    }

    return null;
  }
}
