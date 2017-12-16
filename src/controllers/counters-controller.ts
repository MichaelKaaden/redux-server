import { NextFunction, Request, Response } from "express";

import { Counter } from "../models/counter";
import { BaseController } from "./base-controller";

export class CountersController extends BaseController {
    private _counters: Counter[] = [];

    constructor() {
        super();
    }

    /**
     * Get all values.
     *
     * @param {e.Request} req Request
     * @param {e.Response} res Response
     * @param {e.NextFunction} next Next middleware
     */
    public getCounters(req: Request, res: Response, next: NextFunction): void {
        this.sendJsonResult(res, 200, "okay", {
            counters: this._counters.sort((a: Counter, b: Counter) => (a.index < b.index) ? -1 : 1),
        });
    }

    /**
     * Get some value.
     *
     * @param {e.Request} req Request
     * @param {e.Response} res Response
     * @param {e.NextFunction} next Next middleware
     */
    public getCounter(req: Request, res: Response, next: NextFunction): void {
        const index: number = parseInt(req.params.index, 10);
        const counter = this.getCounterByIndex(index);

        this.sendJsonResult(res, 200, "okay", {
            counter,
        });
    }

    /**
     * Set some value.
     *
     * @param {e.Request} req Request
     * @param {e.Response} res Response
     * @param {e.NextFunction} next Next middleware
     */
    public setCounter(req: Request, res: Response, next: NextFunction): void {
        if (!req.body.count) {
            res.status(404).json("Body required");
            return;
        }

        const index: number = parseInt(req.params.index, 10);
        const counter = parseInt(req.body.count, 10);

        const value = this.getCounterByIndex(index);
        value.value = counter;

        // return either the real value or 0 if it doesn't exist (default count)
        this.sendJsonResult(res, 200, "okay", {
            value,
        });
    }

    /**
     * Retrieve the counter by index.
     * If the counter doesn't exist yet, add it to the list of counters.
     *
     * @param {number} index
     * @return {}
     */
    private getCounterByIndex(index: number): Counter {
        const counters = this._counters.filter((val: Counter) => val.index === index);
        let counter;

        if (counters.length === 1) {
            counter = counters[0];
        } else {
            counter = new Counter(index, 0);
            this._counters.push(counter);
        }
        return counter;
    }
}
