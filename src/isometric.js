class Isometric {
    
}

class I2DMap {
    /**                    [a
     *   [[a, b],   =>   [c  `b]
     *    [c, d]]          `d]
     */

    constructor(_array, _width, _height) {
        this.array = _array;
        this.width = _width;
        this.height = _height;
    }

    /** Iterates over the array and call the given function passing {x, y, value} for isometric view
     * 
     * @param {Function} _function - Function to be called with isometric parameters as arguments
     */
    foreach(_function) {
        for(let row in this.array) {
            for(let col in this.array[row]) {
                let pos_x = ((this.array.length-1) * this.width / 2) - (Number(row) * this.width / 2) + (Number(col) * this.width / 2);
                let pos_y = (Number(col) + Number(row)) * this.height / 2;
                _function({ 'x': pos_x, 'y': pos_y, 'value': this.array[row][col] });
            }
        }
    }
}

class I3DMap extends I2DMap {
    /**                            [a
     * [[[a, b], [c, d]],        [c  `b]
     *   [[e, f], [g, h]]]   =>   |`d]|
     *                           [g |`f]
     *                             `h]
     */

    constructor(_array, _size_x, _size_y, _size_z) {
        super(_array, _size_x, _size_y);
        this.size_z = _size_z;
    }

    /** Iterates over the array and call the given function passing {x, y, value} for isometric view
     * 
     * @param {Function} _function - Function to be called with isometric parameters as arguments
     * @param {Number} _step - Step to iterate, negative number iterate the array in reverse (Default: 1)
     */
    foreach(_function, _step=1) {
        if(_step == 0) _step = 1;

        const check_step = (_layer) => {
            if(_step < 0) return _layer >= 0;
            return _layer < this.array.length;
        };

        let layer = _step < 0? this.array.length: 0;
        while(check_step(layer)) {
            for(let row in this.array[layer]) {
                for(let col in this.array[layer][row]) {
                    let pos_x = ((this.array[layer].length-1) * this.width / 2) - (Number(row) * this.width / 2) + (Number(col) * this.width / 2);
                    let pos_y = ((Number(col) + Number(row)) * this.height / 2) + (this.size_z * Number(layer));
                    _function({ 'x': pos_x, 'y': pos_y, 'value': this.array[layer][row][col] });
                }
            }
            layer += _step;
        }
    }
}