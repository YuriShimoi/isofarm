class Canvas {
    constructor(__el__=null) {
        if(__el__) this.element = __el__;
        else this.element = document.createElement('CANVAS');


    }

    clear() {
        
    }
}