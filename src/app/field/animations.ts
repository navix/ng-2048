import { animate, AnimationMetadata, keyframes, state, style, transition, trigger, } from '@angular/animations';

export function compile(size: number, duration: number) {
  return function () {
    let animations: AnimationMetadata[] = [
      state('base', style({
        transform: 'translateX(0) scale(1)',
      })),
      state('moveUp', style({})),
      state('moveRight', style({})),
      state('moveDown', style({})),
      state('moveLeft', style({})),
    ];
    for (let i = 1; i <= size; i++) {
      animations.push(
          moveUp(duration, i),
          moveRight(duration, i),
          moveDown(duration, i),
          moveLeft(duration, i),
      );
    }
    return trigger('tile', animations);
  }();
}
export function moveUp(duration: number, step: number) {
  return function () {
    return transition(`base => moveUp-${step}`, [
      animate(duration, keyframes([
        style({transform: 'translateY(0)', zIndex: 1, offset: 0}),
        style({transform: `translateY(-${step * 100}%)`, zIndex: 1, offset: 0.7}),
        style({transform: `translateY(-${step * 100}%) scale(1.1)`, zIndex: 1, offset: 0.85}),
        style({transform: `translateY(-${step * 100}%) scale(1)`, zIndex: 1, offset: 1}),
      ])),
    ]);
  }();
}
export function moveRight(duration: number, step: number) {
  return function () {
    return transition(`base => moveRight-${step}`, [
      animate(duration, keyframes([
        style({transform: 'translateX(0)', zIndex: 1, offset: 0}),
        style({transform: `translateX(${step * 100}%)`, zIndex: 1, offset: 0.7}),
        style({transform: `translateX(${step * 100}%) scale(1.1)`, zIndex: 1, offset: 0.85}),
        style({transform: `translateX(${step * 100}%) scale(1)`, zIndex: 1, offset: 1}),
      ])),
    ]);
  }();
}
export function moveDown(duration: number, step: number) {
  return function () {
    return transition(`base => moveDown-${step}`, [
      animate(duration, keyframes([
        style({transform: 'translateY(0)', zIndex: 1, offset: 0}),
        style({transform: `translateY(${step * 100}%)`, zIndex: 1, offset: 0.7}),
        style({transform: `translateY(${step * 100}%) scale(1.1)`, zIndex: 1, offset: 0.85}),
        style({transform: `translateY(${step * 100}%) scale(1)`, zIndex: 1, offset: 1}),
      ])),
    ]);
  }();
}
export function moveLeft(duration: number, step: number) {
  return function () {
    return transition(`base => moveLeft-${step}`, [
      animate(duration, keyframes([
        style({transform: 'translateX(0)', zIndex: 1, offset: 0}),
        style({transform: `translateX(-${step * 100}%)`, zIndex: 1, offset: 0.7}),
        style({transform: `translateX(-${step * 100}%) scale(1.1)`, zIndex: 1, offset: 0.85}),
        style({transform: `translateX(-${step * 100}%) scale(1)`, zIndex: 1, offset: 1}),
      ])),
    ]);
  }();
}