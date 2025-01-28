class Canvas {
    static RESOLUTION = {width: 1920, height: 920};

    /** Handles canvas related objects and simplifies drawing methods
     * 
     * @param {HTMLElement} _element - Canvas element (Default: Creates a new element)
     */
    constructor(_element=null) {
        if(_element) this.$element = _element;
        else this.$element = document.createElement('CANVAS');

        this.$element.setAttribute('width', Canvas.RESOLUTION.width);
        this.$element.setAttribute('height', Canvas.RESOLUTION.height);

        this.ctx = this.$element.getContext('2d');
    }

    /** Clear the *this.$element* canvas */
    clear() {
        this.ctx.clearRect(0, 0, Canvas.RESOLUTION.width, Canvas.RESOLUTION.height);
    }

    /** Drawns the image on canvas at given position
     * 
     * @param {string} img_src - Source URL of the image to be draw
     * @param {number} pos_x - Position x at canvas (Default: 0)
     * @param {number} pos_y - Position y at canvas (Default: 0)
     */
    drawImage(img_src, pos_x=0, pos_y=0) {
        ImageLoader.load(img_src).then(img => {
            this.ctx.drawImage(img, pos_x, pos_y);
        });
    }

    /** Returns the canvas element */
    getElement() {
        return this.$element;
    }

    /** Sets the container element of the canvas
     * 
     * @param {HTMLElement} container - Container element of the canvas
     */
    setContainer(container) {
        this.$container = container;
    }

    /** Append the this.$element to the container
     * 
     * @param {HTMLElement} container - Container element of the canvas (Default: this.$container)
     */
    instantiate(container=null) {
        if(container !== null) this.setContainer(container);
        this.$container.appendChild(this.$element);
    }
}

class ImageLoader {
    static MEMORY = {};

    /** Return the image object if it exists in ImageLoader.MEMORY
     * 
     * @param {string} img_src - Source URL from image
     */
    static get(img_src) {
        return this.MEMORY[img_src];
    }

    /** Load or get the image from the ImageLoader.MEMORY and return a Promise with the image object
     * 
     * @param {string} img_src - Source URL from image
     * @returns {Promise<image>} Return a Promise with the image object as output parameter
     */
    static load(img_src) {
        if(!this.hasInMemory(img_src)) {
            this.register(img_src);
            
            return new Promise(resolve => {
                ImageLoader.get(img_src).onload = () => resolve(ImageLoader.get(img_src));
            });
        }
        return new Promise(resolve => {
            resolve(ImageLoader.get(img_src));
        });
    }

    /** Register the source URL in the ImageLoader.MEMORY and build the image object
     * 
     * @param {string | Array<string>} img_src - Source URL from image
     */
    static register(img_src) {
        if(!Array.isArray(img_src)) img_src = [img_src];

        for(let isrc of img_src) {
            if(!this.hasInMemory(isrc)) {
                this.MEMORY[isrc] = new Image;
                this.MEMORY[isrc].src = isrc;
            }
        }
    }

    /** Check if the source URL is registered in ImageLoader.MEMORY
     * 
     * @param {string} img_src - Source URL from image
     * @returns {boolean}
     */
    static hasInMemory(img_src) {
        return img_src in this.MEMORY;
    }
}