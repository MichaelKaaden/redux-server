import { NextFunction, Request, Response, Router } from "express";

export class DateController {
    private date: Date;

    constructor() {
        this.date = new Date();
    }

    public getDate(req: Request, res: Response, next: NextFunction): void {
        console.log("authenticated user (retrieved from token)", req.user.jwtUser);
        const user = req.user.jwtUser;
        res.render("date", {
            date: this.date,
            title: `Date Controller Test for ${user.name}`,
        });
    }
}
