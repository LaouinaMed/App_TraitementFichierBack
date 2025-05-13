export class LogsErreur{
    id: number;
    fileName : string;
    ligne : number;
    message : string;
    dateCreation : string;

    constructor(){
        this.id = 0;
        this.fileName = '';
        this.ligne = 0;
        this.message = '';
        this.dateCreation = '';
    }
}