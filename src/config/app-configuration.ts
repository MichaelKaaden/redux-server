export interface IAppConfiguration {
    secret: string;
}

export class AppConfiguration implements IAppConfiguration {
    private configuration: IAppConfiguration;

    constructor() {
        this.configuration = require(`./${process.env.NODE_ENV}.js`);
    }

    public get secret(): string {
        return this.configuration.secret;
    }
}
