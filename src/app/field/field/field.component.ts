import {
  Component, OnInit, HostListener, AfterViewChecked, trigger, state, style, transition,
  animate,
  keyframes
} from '@angular/core';
import { moveRight, compile } from '../animations';

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
  ]
})
export class FieldComponent implements OnInit, AfterViewChecked {

  @HostListener('document:keydown.ArrowUp', ['$event.target']) arrowUp() {
    this.moveUp();
  };

  @HostListener('document:keydown.ArrowRight', ['$event.target']) arrowRight() {
    this.moveRight();
  };

  @HostListener('document:keydown.ArrowDown', ['$event.target']) arrowDown() {
    this.moveDown();
  };

  @HostListener('document:keydown.ArrowLeft', ['$event.target']) arrowLeft() {
    this.moveLeft();
  };

  private grid = new Array(size).fill(new Array(size).fill(null));

//  private state$ = new BehaviorSubject<FieldState>(new Array(size).fill(null).map(_ => new Array(size).fill(null)));
  private field: FieldState = new Array(size).fill(null).map(_ => new Array(size).fill(null));
  private fieldView: FieldState;

  private animations: AnimationState;
  private animationsView: AnimationState;

  tileWidth = 100;
  tileHeight = 100;

  constructor() {
  }

  ngOnInit() {
    console.log('Init state', this.field);
    this.resetAnimations();
    this.fillRandom();
    this.render(false);
  }

  ngAfterViewChecked() {
    console.log('ViewChecked');
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

  moveUp() {
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

  moveRight() {
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

  moveDown() {
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

  private mergeTiles(field: FieldState, rowIndex: number, tileIndex: number, direction: Direction) {
    const size = field.length;
    const tileValue = field[rowIndex][tileIndex];
    // calc destination coordinates
    const destRowIndex = direction === 'up' ? rowIndex - 1 : direction === 'down' ? rowIndex + 1 : rowIndex;
    const destTileIndex = direction === 'left' ? tileIndex - 1 : direction === 'right' ? tileIndex + 1 : tileIndex;
    // check edges
    if (destRowIndex >= 0 && destRowIndex < size && destTileIndex >= 0 && destTileIndex < size) {
      if (field[destRowIndex][destTileIndex] === null) {
        // move to destination
        field[destRowIndex][destTileIndex] = tileValue;
        field[rowIndex][tileIndex] = null;
        return false;
      } else if (field[destRowIndex][destTileIndex] === tileValue) {
        // merge with destination
        field[destRowIndex][destTileIndex] *= 2;
        field[rowIndex][tileIndex] = null;
        return true;
      }
      else {
        // destination is not equal
        return null;
      }
    }
    else {
      // this is the edge
      return null;
    }
  }

  resetAnimations() {
    this.animations = new Array(size).fill(null).map(_ => new Array(size).fill('base'));
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

  clone(state) {
    let copy = [];
    state.forEach(row => {
      copy.push([...row]);
    });
    return copy;
  }


}
