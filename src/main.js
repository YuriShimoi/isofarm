class GAME {
    static CV_BACKGROUND = new Canvas();
    static CV_TILESET = new Canvas();
    static CV_BUILDING = new Canvas();
    static CV_ENTITY = new Canvas();
    static CV_EFFECT = new Canvas();


    /** Load Saves in Memory */
    static load() {
        if(Memory.hasSave()) Memory.load();
    }

    /** Load the game and init canvas */
    static init() {
        this.load();

        this.init_canvas();
    }
    
    //#region [CANVAS]

    /** Instantiate all canvases to #main */
    static init_canvas() {
        
    }

    /** Clear and load the canvas visuals
     * 
     * @param {Array<Canvas>|Canvas} update_list - List of canvas to reload (Default: All canvases)
     */
    static reload_canvas(update_list=[this.CV_BACKGROUND, this.CV_TILESET, this.CV_BUILDING, this.CV_ENTITY, this.CV_EFFECT]) {
        if(!Array.isArray(update_list)) {
            update_list = [update_list];
        }

        this.clear_canvas(update_list);

    }

    /** Clear the canvas
     * 
     * @param {Array<Canvas>|Canvas} clear_list - List of canvas to clear. (Default: All canvases)
     */
    static clear_canvas(clear_list=[this.CV_BACKGROUND, this.CV_TILESET, this.CV_BUILDING, this.CV_ENTITY, this.CV_EFFECT]) {
        if(!Array.isArray(clear_list)) {
            clear_list = [clear_list];
        }

        for(let canvas of clear_list) {
            canvas.clear();
        }
    }

    //#endregion

}

GAME.init();