class Isometric {
    constructor(mapping, start_x=0, start_y=0) {
        this.map_list = [];
        this.map_extra = [];
        if(mapping) this.map(mapping, start_x, start_y);
    }

    map(mapping, start_x=0, start_y=0) {
        this.map_list.push(mapping);
        this.map_extra.push({
            'x': start_x,
            'y': start_y
        });
    }

    unmap(mapping) {
        const map_index = this.indexOf(mapping);
        if(map_index !== undefined) {
            this.map_list.splice(map_index, 1);
            this.map_extra.splice(map_index, 1);
        }
        
        return map_index;
    }

    move(mapping, start_x=false, start_y=false, bottom_layer=false) {
        const map_index = this.indexOf(mapping);
        if(map_index !== undefined) {
            if(start_x !== false) this.map_extra[map_index].x = start_x;
            if(start_y !== false) this.map_extra[map_index].y = start_y;
            if(bottom_layer !== false) this.map_extra[map_index].z = bottom_layer;
        }
        
        return this.map_extra[map_index];
    }

    indexOf(mapping) {
        for(let mi in this.map_list) {
            if(this.map_list[mi] === mapping) return Number(mi);
        }
        return undefined;
    }

    get(px, py) {
        const collide2D = (map_index) => {
            return px >= this.map_extra[map_index].x
                && py >= this.map_extra[map_index].y
                && px <= (this.map_extra[map_index].x + this.map_list[map_index].max_width)
                && py <= (this.map_extra[map_index].y + this.map_list[map_index].max_height);
        };

        let collidable = [];
        for(let mi in this.map_list) {
            if(collide2D(mi)) collidable.push(mi);
        }

        collidable.sort((ant, nex) => nex.layer_z - ant.layer_z);
        let ctile = null;
        for(let col_map of collidable) {
            this.map_list[col_map].foreachIso((tile) => {
                let cpx = px - this.map_extra[col_map].x;
                let cpy = py - this.map_extra[col_map].y;
                if(tile.value, tile.collide(cpx, cpy)) {
                    ctile = tile;
                    return true;
                }
            });
            if(ctile) break;
        }

        return ctile;
    }
}

class I2DMap {
    /**                    [a
     *   [[a, b],   =>   [c  `b]
     *    [c, d]]          `d]
     */

    static IMapTile = class {
        constructor(_x, _y, _width, _height, _depth, _value) {
            this.x = _x;
            this.y = _y;
            this.width = _width;
            this.height = _height;
            this.depth = _depth;
            this.value = _value;
        }

        collide(px, py) {
            if(px >= this.x && py >= this.y
            && px <= (this.x + this.width)
            && py <= (this.y + this.height + this.depth)) {
                const height = this.height / 2;
                const width = this.width;
                if(py < (height + this.y)) {
                    return (py <= this.y + height)
                        && (py >= (-(2 * height / width * (px - this.x - (width / 2))) + this.y))
                        && (py >= ((2 * height / width * (px - this.x - (width / 2))) + this.y));
                }
                else if(py > (this.y + (height + this.depth))) {
                    const sx = this.x;
                    const sy = this.y + (height + this.depth);
                    return (py >= sy)
                        && (py <= ((2 * height / width * (px - sx)) + sy))
                        && (py <= (-(2 * height / width * (px - sx)) + sy + 2 * height));
                }
                return true;
            }

            return false;
        }
    }

    static __id__ = 0;
    static get new_id() {
        return this.__id__++;
    }

    get max_width() {
        return (this.array.length + this.array[0].length) * this.width / 2;
    }
    get max_height() {
        return ((this.array.length + this.array[0].length) * this.height / 2) + (this.array.length * this.depth);
    }

    get layers() {
        return 1;
    }

    __array__ = [];
    get array() {
        return this.__array__;
    }
    set array(_array) {
        this.__array__ = _array;
        this._updateIsoArray();
    }

    constructor(_array, _width, _height, _depth=0, _layer_z=0) {
        this.id = I2DMap.new_id;

        this.width = _width;
        this.height = _height;
        this.depth = _depth;
        this.layer_z = _layer_z;
        this.array = _array;
    }

    /** Iterates over the array and call the given function passing {x, y, value} for isometric view
     * 
     * @param {Function} _function - Function to be called with isometric parameters as arguments
     */
    foreach(_function) {
        for(let row in this.array) {
            for(let col in this.array[row]) {
                let pos_x = ((this.array.length-1) * this.width / 2) - (Number(row) * this.width / 2) + (Number(col) * this.width / 2);
                let pos_y = (Number(col) + Number(row)) * (this.height - this.depth) / 2;
                _function(new I2DMap.IMapTile(pos_x, pos_y, this.width, this.height - this.depth, this.depth, this.array[row][col]));
            }
        }
    }

    /** Iterates over the array in isometric Z order and call the given function passing {x, y, value}
     * 
     * @param {Function} _function - Function to be called with isometric parameters as arguments
     */
    foreachIso(_function) {
        for(let tile of this.sorted_array) {
            if(_function(tile)) return;
        }
    }

    _updateIsoArray() {
        let aux_array = {};
        for(let row in this.array) {
            for(let col in this.array[row]) {
                let index = Number(row) + Number(col);
                let pos_x = ((this.array.length-1) * this.width / 2) - (Number(row) * this.width / 2) + (Number(col) * this.width / 2);
                let pos_y = (Number(col) + Number(row)) * (this.height - this.depth) / 2;
                if(index in aux_array)
                    aux_array[index].push(new I2DMap.IMapTile(pos_x, pos_y, this.width, this.height - this.depth, this.depth, this.array[row][col]));
                else
                    aux_array[index] = [new I2DMap.IMapTile(pos_x, pos_y, this.width, this.height - this.depth, this.depth, this.array[row][col])];
            }
        }
        
        this.sorted_array = [];
        for(let index in aux_array) {
            this.sorted_array.unshift(...aux_array[index]);
        }
    }
}

class I3DMap extends I2DMap {
    /**                            [e
     * [[[a, b], [c, d]],        [g  `f]
     *   [[e, f], [g, h]]]   =>   |`h]|
     *                           [c |`b]
     *                             `d]
     */
    
    get max_width() {
        return (this.array[0].length + this.array[0][0].length) * this.width / 2;
    }
    get max_height() {
        return ((this.array[0].length + this.array[0][0].length) * this.height / 2) + (this.array.length * this.depth);
    }

    get layers() {
        return this.array.length;
    }

    constructor(_array, _width, _height, _depth=0, _layer_z=0) {
        super(_array, _width, _height, _depth, _layer_z);
    }

    /** Iterates over the array and call the given function passing {x, y, value} for isometric view
     * 
     * @param {Function} _function - Function to be called with isometric parameters as arguments
     * @param {Number} _step - Step to iterate, negative numbers iterates the array in reverse (Default: 1)
     */
    foreach(_function, _step=1) {
        if(_step === 0) _step = 1;

        const check_step = (_layer) => {
            if(_step < 0) return _layer >= 0;
            return _layer < this.array.length;
        };

        let layer = _step < 0? this.array.length: 0;
        while(check_step(layer)) {
            for(let row in this.array[layer]) {
                for(let col in this.array[layer][row]) {
                    let pos_x = ((this.array[layer].length-1) * this.width / 2) - (Number(row) * this.width / 2) + (Number(col) * this.width / 2);
                    let pos_y = ((Number(col) + Number(row)) * (this.height - this.depth) / 2) + (this.depth * ((this.layers - 1) - Number(layer)));
                    _function(new I2DMap.IMapTile(pos_x, pos_y, this.width, this.height - this.depth, this.depth, this.array[layer][row][col]));
                }
            }
            layer += _step;
        }
    }
    
    _updateIsoArray() {
        let aux_array = {};
        for(let layer in this.array) {
            for(let row in this.array[layer]) {
                for(let col in this.array[layer][row]) {
                    if(!(layer in aux_array)) aux_array[layer] = {};

                    let index = Number(row) + Number(col);
                    let pos_x = ((this.array[layer].length-1) * this.width / 2) - (Number(row) * this.width / 2) + (Number(col) * this.width / 2);
                    let pos_y = ((Number(col) + Number(row)) * (this.height - this.depth) / 2) + (this.depth * ((this.layers - 1) - Number(layer)));
                    if(index in aux_array[layer])
                        aux_array[layer][index].push(new I2DMap.IMapTile(pos_x, pos_y, this.width, this.height - this.depth, this.depth, this.array[layer][row][col]));
                    else
                        aux_array[layer][index] = [new I2DMap.IMapTile(pos_x, pos_y, this.width, this.height - this.depth, this.depth, this.array[layer][row][col])];
                }
            }
        }

        this.sorted_array = [];
        for(let layer in aux_array) {
            for(let index in aux_array[layer]) {
                this.sorted_array.unshift(...aux_array[layer][index]);
            }
        }
    }
}