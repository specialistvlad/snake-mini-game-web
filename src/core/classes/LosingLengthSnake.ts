import { CellType, TCells } from '../types';
import { Snake } from './Snake';

export class LosingLengthSnake extends Snake {
    protected stepsLeftToDecreaseLength: number = 10;
    protected stepsForEachFood: number = 10;
    
    get stepsLeft(): number {
        return ((this._snake.length - 1) * this.stepsForEachFood) + this.stepsLeftToDecreaseLength;
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

        if (this.disgustingPoison(gameCells)) {
            return;
        }

        if (this.usualStepForward(gameCells)) {
            return;
        }
    }

    protected looseLength(gameCells: TCells): boolean {
        this.stepsLeftToDecreaseLength--;
        if (this.stepsLeftToDecreaseLength === 0) {
            if (this._snake.length >= 2) {
                this.stepsLeftToDecreaseLength = this.stepsForEachFood;
                this._snake = [this.getNextCoord(), ...this._snake.slice(0, this._snake.length - 2)];
                this._reward = this.rewards.step;
                return true;
            }
            this.die();
            return true;
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
        if (this.nextCell(gameCells)?.type === CellType.food) {
            this.stepsLeftToDecreaseLength = this.stepsForEachFood;
            this._snake = [this.getNextCoord(), ...this._snake];

            this._foodEaten = 1;
            this._reward = this.rewards.food;

            return true;
        }

        return false;
    }
};