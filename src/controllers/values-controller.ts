import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "./base-controller";

export class Value {
    constructor(public index: number, public value: number) {
    }
}

export class ValuesController extends BaseController {
    private _values: Value[] = [];

    constructor() {
        super();
        }

    public getValues(req: Request, res: Response, next: NextFunction): void {
        this.sendJsonResult(res, 200, "okay", {
            values: this._values.sort((a: Value, b: Value) => (a < b) ? -1 : 1),
        });
    }
}
