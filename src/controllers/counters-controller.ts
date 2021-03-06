import { NextFunction, Request, Response } from "express";

import { Counter } from "../models/counter";
import { BaseController } from "./base-controller";

export class CountersController extends BaseController {
    private _counters: Counter[] = [];

    /**
     * @swagger
     * tags:
     * - name: "Counter"
     *   description: "Get, set and update counters"
     * definitions:
     *      Counter:
     *          type: object
     *          required:
     *              - index
     *              - value
     *          properties:
     *              index:
     *                  type: integer
     *                  example: 0
     *              value:
     *                  type: integer
     *                  example: 42
     */
    constructor() {
        super();
    }

    /**
     * @swagger
     * /counters:
     *      get:
     *          tags:
     *          - "Counter"
     *          summary: "Returns all counters."
     *          produces:
     *          - application/json
     *          responses:
     *              200:
     *                  description: OK
     *                  schema:
     *                      type: object
     *                      properties:
     *                          data:
     *                              type: object
     *                              properties:
     *                                  counters:
     *                                      type: array
     *                                      items:
     *                                          $ref: '#/definitions/Counter'
     *                          message:
     *                              type: string
     *                              description: okay
     *                              example: okay
     *                          status:
     *                              type: integer
     *                              description: HTTP status code
     *                              example: 200
     */
    public getCounters(req: Request, res: Response, next: NextFunction): void {
        this.sendJsonResult(res, 200, "okay", {
            counters: this._counters.sort((a: Counter, b: Counter) => (a.index < b.index) ? -1 : 1),
        });
    }

    /**
     * @swagger
     * /counters/{index}:
     *      get:
     *          tags:
     *          - "Counter"
     *          summary: "Returns the counter at the specified index."
     *          produces:
     *              - application/json
     *          parameters:
     *              - name: "index"
     *                description: "The index the counter should be retrieved for"
     *                in: "path"
     *                required: true
     *                type: "integer"
     *          responses:
     *              200:
     *                  description: OK
     *                  schema:
     *                      type: object
     *                      properties:
     *                          data:
     *                              type: object
     *                              properties:
     *                                  counter:
     *                                      type: object
     *                                      $ref: '#/definitions/Counter'
     *                          message:
     *                              type: string
     *                              description: okay
     *                              example: okay
     *                          status:
     *                              type: integer
     *                              description: HTTP status code
     *                              example: 200
     */
    public getCounter(req: Request, res: Response, next: NextFunction): void {
        const index: number = parseInt(req.params.index, 10);
        const counter = this.getCounterByIndex(index);

        this.sendJsonResult(res, 200, "okay", {
            counter,
        });
    }

    /**
     * @swagger
     * /counters/{index}:
     *      put:
     *          tags:
     *          - "Counter"
     *          summary: "Sets the counter at the specified index."
     *          produces:
     *              - application/json
     *          consumes:
     *              - application/x-www-form-urlencoded
     *          parameters:
     *              - name: "index"
     *                description: "The counter's index"
     *                in: "path"
     *                required: true
     *                type: "integer"
     *              - name: "count"
     *                description: "The value the counter should be set to"
     *                in: "formData"
     *                type: "integer"
     *                required: true
     *          responses:
     *              200:
     *                  description: OK
     *                  schema:
     *                      type: object
     *                      properties:
     *                          data:
     *                              type: object
     *                              properties:
     *                                  counter:
     *                                      type: object
     *                                      $ref: '#/definitions/Counter'
     *                          message:
     *                              type: string
     *                              description: okay
     *                              example: okay
     *                          status:
     *                              type: integer
     *                              description: HTTP status code
     *                              example: 200
     *              404:
     *                  description: Body missing
     */
    public setCounter(req: Request, res: Response, next: NextFunction): void {
        if (req.body.count === undefined) {
            res.status(404).json("Body required");
            return;
        }

        const index: number = parseInt(req.params.index, 10);
        const counter = parseInt(req.body.count, 10);

        const value = this.getCounterByIndex(index);
        value.value = counter;

        // return either the real value or 0 if it doesn't exist (default count)
        this.sendJsonResult(res, 200, "okay", {
            counter: value,
        });
    }

    /**
     * @swagger
     * /counters/{index}/decrement:
     *      put:
     *          tags:
     *          - "Counter"
     *          summary: "Decrements the counter at the specified index by the given value."
     *          produces:
     *              - application/json
     *          consumes:
     *              - application/x-www-form-urlencoded
     *          parameters:
     *              - name: "index"
     *                description: "The counter's index"
     *                in: "path"
     *                required: true
     *                type: "integer"
     *              - name: "by"
     *                description: "The value the counter should be decremented with (or 1 if missing)"
     *                default: 1
     *                in: "formData"
     *                type: "integer"
     *                required: false
     *          responses:
     *              200:
     *                  description: OK
     *                  schema:
     *                      type: object
     *                      properties:
     *                          data:
     *                              type: object
     *                              properties:
     *                                  counter:
     *                                      type: object
     *                                      $ref: '#/definitions/Counter'
     *                          message:
     *                              type: string
     *                              description: okay
     *                              example: okay
     *                          status:
     *                              type: integer
     *                              description: HTTP status code
     *                              example: 200
     */
    public decrementCounter(req: Request, res: Response, next: NextFunction): void {
        const index: number = parseInt(req.params.index, 10);
        let by: number = 1;

        if (req.body.by) {
            by = parseInt(req.body.by, 10);
        }

        const value = this.getCounterByIndex(index);
        value.value -= by;

        this.sendJsonResult(res, 200, "okay", {
            counter: value,
        });
    }

    /**
     * @swagger
     * /counters/{index}/increment:
     *      put:
     *          tags:
     *          - "Counter"
     *          summary: "Increments the counter at the specified index by the given value."
     *          produces:
     *              - application/json
     *          consumes:
     *              - application/x-www-form-urlencoded
     *          parameters:
     *              - name: "index"
     *                description: "The counter's index"
     *                in: "path"
     *                required: true
     *                type: "integer"
     *              - name: "by"
     *                description: "The value the counter should be incremented with (or 1 if missing)"
     *                default: 1
     *                in: "formData"
     *                type: "integer"
     *                required: false
     *          responses:
     *              200:
     *                  description: OK
     *                  schema:
     *                      type: object
     *                      properties:
     *                          data:
     *                              type: object
     *                              properties:
     *                                  counter:
     *                                      type: object
     *                                      $ref: '#/definitions/Counter'
     *                          message:
     *                              type: string
     *                              description: okay
     *                              example: okay
     *                          status:
     *                              type: integer
     *                              description: HTTP status code
     *                              example: 200
     */
    public incrementCounter(req: Request, res: Response, next: NextFunction): void {
        const index: number = parseInt(req.params.index, 10);
        let by: number = 1;

        if (req.body.by) {
            by = parseInt(req.body.by, 10);
        }

        const value = this.getCounterByIndex(index);
        value.value += by;

        this.sendJsonResult(res, 200, "okay", {
            counter: value,
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
