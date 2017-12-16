import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "./base-controller";

export class UsersController extends BaseController {
    constructor() {
        super();
    }

    public getUsers(req: Request, res: Response, next: NextFunction): void {
        this.sendJsonResult(res, 200, "okay", {greeting: "Hello World!"});
    }
}
