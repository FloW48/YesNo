module.exports = class Command{

    static parse(message, bot){
        if (this.match(message)){
            this.action(message, bot);
            return true;
        }
        return false;
    }

    static match(message){
    }

    static action(message){
    }

}