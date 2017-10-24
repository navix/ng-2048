import { AfterViewChecked, Component, HostListener, OnInit } from '@angular/core';
import { compile } from '../animations';

const size = 4;
const baseValue = 2;
export type FieldState = number[][];
export type Direction = 'up' | 'right' | 'down' | 'left';
export type AnimationState = Animation[][];
export type Animation = string;
export const animationDuration = 300;

// @todo do not randomize if tiles didnt move
@Component({
  selector: 'fm-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  animations: [
    compile(size, animationDuration),
  ],
})
export class FieldComponent implements OnInit, AfterViewChecked {
  tileHeight = 100;

  tileWidth = 100;

  private animations: AnimationState;

  private animationsView: AnimationState;

  private field: FieldState = new Array(size).fill(null).map(_ => new Array(size).fill(null));

  private fieldMergeBlock: boolean[][];

  private fieldView: FieldState;

  private grid = new Array(size).fill(new Array(size).fill(null));

  constructor() {
  }

  ngAfterViewChecked() {
    console.log('ViewChecked');
  }

  ngOnInit() {
    console.log('Init state', this.field);
    this.resetAnimations();
    this.fillRandom();
    this.render(false);
  }

  @HostListener('document:keydown.ArrowDown', ['$event.target'])
  arrowDown() {
    this.moveDown();
  };

  @HostListener('document:keydown.ArrowLeft', ['$event.target'])
  arrowLeft() {
    this.moveLeft();
  };

  @HostListener('document:keydown.ArrowRight', ['$event.target'])
  arrowRight() {
    this.moveRight();
  };

  @HostListener('document:keydown.ArrowUp', ['$event.target'])
  arrowUp() {
    this.moveUp();
  };

  clone(state) {
    let copy = [];
    state.forEach(row => {
      copy.push([...row]);
    });
    return copy;
  }

  fill(x: number, y: number) {
    this.field[x][y] = baseValue;
  }

  fillRandom() {
    // gather empty
    let empties = [];
    let max = baseValue;
    this.field.forEach((row, rowIndex) => {
      row.forEach((tile, tileIndex) => {
        if (tile === null) {
          empties.push([rowIndex, tileIndex]);
        } else if (tile > max) {
          max = tile;
        }
      });
    });
    if (empties.length === 0) {
      alert('Game over!');
    }
    // randomizer
    let value = baseValue;
    if (max > baseValue ** baseValue) {
      const end = max / baseValue ** baseValue;
      let current = baseValue;
      let stack = [];
      while (current <= end) {
        stack.push(current);
        current *= baseValue;
      }
      value = stack[Math.floor(Math.random() * stack.length)];
    }
    let coords = empties[Math.floor(Math.random() * empties.length)];
    this.field[coords[0]][coords[1]] = value;
    // @todo immu
    //this.state$.next(field);
  }

  moveDown() {
    this.initMovement();
    let moved = false;
    // iterate from down to top
    for (let rowIndex = size - 1; rowIndex >= 0; rowIndex--) {
      // iterate from left to right
      for (let tileIndex = 0; tileIndex < size; tileIndex++) {
        // check value
        if (this.field[rowIndex][tileIndex] !== null) {
          // move to down edge
          let searchIndex;
          for (searchIndex = rowIndex; searchIndex < size; searchIndex++) {
            let mergeResult = this.mergeTiles(this.field, searchIndex, tileIndex, 'down');
            if (mergeResult !== false) {
              const diff = mergeResult === true ? searchIndex - rowIndex + 1 : searchIndex - rowIndex;
              if (diff !== 0) {
                moved = true;
                this.animations[rowIndex][tileIndex] = `moveDown-${diff}`;
              }
              break;
            }
          }
        }
      }
    }
    if (moved) {
      this.fillRandom();
      this.render();
    }
  }

  moveLeft() {
    this.initMovement();
    let moved = false;
    // iterate from top to down
    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      // iterate from left to right
      for (let tileIndex = 0; tileIndex < size; tileIndex++) {
        // check value
        if (this.field[rowIndex][tileIndex] !== null) {
          // move to left edge
          let searchIndex;
          for (searchIndex = tileIndex; searchIndex >= 0; searchIndex--) {
            let mergeResult = this.mergeTiles(this.field, rowIndex, searchIndex, 'left');
            if (mergeResult !== false) {
              const diff = mergeResult === true ? tileIndex - searchIndex + 1 : tileIndex - searchIndex;
              if (diff !== 0) {
                moved = true;
                this.animations[rowIndex][tileIndex] = `moveLeft-${diff}`;
              }
              break;
            }
          }
        }
      }
    }
    if (moved) {
      this.fillRandom();
      this.render();
    }
  }

  moveRight() {
    this.initMovement();
    let moved = false;
    // iterate from top to down
    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      // iterate from right to left
      for (let tileIndex = size - 1; tileIndex >= 0; tileIndex--) {
        // check value
        if (this.field[rowIndex][tileIndex] !== null) {
          // move to right edge
          let searchIndex;
          for (searchIndex = tileIndex; searchIndex < size; searchIndex++) {
            let mergeResult = this.mergeTiles(this.field, rowIndex, searchIndex, 'right');
            if (mergeResult !== false) {
              const diff = mergeResult === true ? searchIndex - tileIndex + 1 : searchIndex - tileIndex;
              if (diff !== 0) {
                moved = true;
                this.animations[rowIndex][tileIndex] = `moveRight-${diff}`;
              }
              break;
            }
          }
        }
      }
    }
    if (moved) {
      this.fillRandom();
      this.render();
    }
  }

  moveUp() {
    this.initMovement();
    let moved = false;
    // iterate from top to down
    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      // iterate from left to right
      for (let tileIndex = 0; tileIndex < size; tileIndex++) {
        // check value
        if (this.field[rowIndex][tileIndex] !== null) {
          // move to top edge
          let searchIndex;
          for (searchIndex = rowIndex; searchIndex >= 0; searchIndex--) {
            let mergeResult = this.mergeTiles(this.field, searchIndex, tileIndex, 'up');
            if (mergeResult !== false) {
              const diff = mergeResult === true ? rowIndex - searchIndex + 1 : rowIndex - searchIndex;
              if (diff !== 0) {
                moved = true;
                this.animations[rowIndex][tileIndex] = `moveUp-${diff}`;
              }
              break;
            }
          }
        }
      }
    }
    if (moved) {
      this.fillRandom();
      this.render();
    }
  }

  render(animate = true) {
    if (animate) {
      this.animationsView = this.clone(this.animations);
      setTimeout(() => {
        this.resetAnimations();
        this.animationsView = this.clone(this.animations);
        this.fieldView = this.clone(this.field);
      }, animationDuration);
    }
    else {
      this.animationsView = this.clone(this.animations);
      this.fieldView = this.clone(this.field);
    }
  }

  resetAnimations() {
    this.animations = new Array(size).fill(null).map(_ => new Array(size).fill('base'));
  }

  private initMovement() {
    this.fieldMergeBlock = new Array(size).fill(false).map(_ => new Array(size).fill(false));
  }

  private mergeTiles(field: FieldState, rowIndex: number, tileIndex: number, direction: Direction) {
    const size = field.length;
    const tileValue = field[rowIndex][tileIndex];
    // calc destination coordinates
    const destRowIndex = direction === 'up' ? rowIndex - 1 : direction === 'down' ? rowIndex + 1 : rowIndex;
    const destTileIndex = direction === 'left' ? tileIndex - 1 : direction === 'right' ? tileIndex + 1 : tileIndex;
    // check edges
    if (destRowIndex >= 0 && destRowIndex < size && destTileIndex >= 0 && destTileIndex < size) {
      if (this.fieldMergeBlock[destRowIndex][destTileIndex]) {
        // already merged tile
        return null;
      } else {
        if (field[destRowIndex][destTileIndex] === null) {
          // move to destination
          field[destRowIndex][destTileIndex] = tileValue;
          field[rowIndex][tileIndex] = null;
          return false;
        } else if (field[destRowIndex][destTileIndex] === tileValue) {
          // merge with destination
          field[destRowIndex][destTileIndex] *= 2;
          field[rowIndex][tileIndex] = null;
          // mark merged tile (not it not available to another merge)
          this.fieldMergeBlock[destRowIndex][destTileIndex] = true;
          return true;
        }
        else {
          // destination is not equal
          return null;
        }
      }
    }
    else {
      // this is the edge
      return null;
    }
  }
}
