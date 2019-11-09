export default class LocaleMsg {
    public lang: string;
    public messages: any;
    constructor(lang: string, messages: any) {
        this.lang = lang;
        this.messages = messages;
    }
}
