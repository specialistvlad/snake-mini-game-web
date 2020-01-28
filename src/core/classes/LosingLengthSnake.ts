import { CellType, TCells } from '../types';
import { Snake } from './Snake';

export class LosingLengthSnake extends Snake {
    protected _stepsLeft: number = 30;
    protected stepsForEachFood: number = 15;
    
    get stepsLeft(): number {
        return this._stepsLeft;
    }

    protected step(gameCells: TCells): void {
        if (this.collision(gameCells)) { // collision with tail check
            return;
        }

        if (this.collisionOthers(gameCells)) { // collision in another cells check
            return;
        }

        if (this.tastyFood(gameCells)) { // find food
            return;
        }

        if (this.looseLength(gameCells)) { // seems no steps left to move forward, decreasing length
            return;
        }

        if (this.usualStepForward(gameCells)) {
            return;
        }
    }

    protected looseLength(gameCells: TCells): boolean {
        this._stepsLeft--;
        if (this._stepsLeft === 0) {
            if (this.snake.length >= 2) {
                this._stepsLeft = this.stepsForEachFood;
                this.snake = [this.getNextCoord(), ...this.snake.slice(0, this.snake.length - 2)];
                return true;
            }
            return this._died = true;
        }
        return false;
    }

    /**
     * Detect food in next cell
     * If food found we have to return next coord for snake's head plus current snake
     * 
     * Extended logic is: add extra steps on new cell with food
     * 
     * @returns Return true if we need to stop step managing
     */
    protected tastyFood(gameCells: TCells): boolean {
        const nextCoord = this.getNextCoord();
        const nextCell = this.nextCell(gameCells);
 
        if (nextCell?.type === CellType.food) {
            this._stepsLeft = this.stepsForEachFood;
            this.snake = [nextCoord, ...this.snake];
            return true;
        }

        return false;
    }
};