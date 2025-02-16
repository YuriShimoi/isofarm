class Cursor {
    static CursorInfo = class {
        constructor(_x=0, _y=0, _leftClick=false, _rightClick=false, _element=undefined) {
            this.x = _x;
            this.y = _y;
            this.leftClick = _leftClick;
            this.rightClick = _rightClick;
            this.element = _element;
        }
    };
    static _prop = {
        element: undefined,
        active: false,
        start_x: 0,
        start_y: 0
    };

    static onDrag = (cinfo) => {};
    static onClick = (cinfo) => {};
    static onMove = (cinfo) => {};
    static onDoubleClick = (cinfo) => {};
    static onMouseEnter = (cinfo) => {};
    static onMouseLeave = (cinfo) => {};
    static onMouseDown = (cinfo) => {};
    static onMouseUp = (cinfo) => {};

    /** Watch out mouse events on given element, work only on last time called element
     * 
     * @param {HTMLElement} element - HTML element that trigger the events
     */
    static watch(element) {
        if(this._element) {
            this._element.removeEventListener('contextmenu');
            this._element.removeEventListener('mousemove');
            this._element.removeEventListener('click');
            this._element.removeEventListener('dblclick');
            this._element.removeEventListener('mouseenter');
            this._element.removeEventListener('mouseleave');
            this._element.removeEventListener('mousedown');
            this._element.removeEventListener('mouseup');
        }
        this._element = element;

        element.addEventListener('contextmenu', (c) => {
            Cursor.onClick(new Cursor.CursorInfo(c.offsetX, c.offsetY, false, true, c.target));
            return false;
        });
        element.addEventListener('mousemove', (c) => {
            let cursor_info = new Cursor.CursorInfo(c.offsetX, c.offsetY, c.button == 0, c.button == 2, c.target);
            Cursor.onMove(cursor_info);

            if(Cursor._prop.active) {
                cursor_info.from_x = Cursor._prop.start_x;
                cursor_info.from_y = Cursor._prop.start_y;
                Cursor.onDrag(cursor_info);
            }
        });
        element.addEventListener('click', (c) => {
            Cursor.onClick(new Cursor.CursorInfo(c.offsetX, c.offsetY, true, false, c.target));
        });
        element.addEventListener('dblclick', (c) => {
            Cursor.onDoubleClick(new Cursor.CursorInfo(c.offsetX, c.offsetY, true, false, c.target));
        });
        element.addEventListener('mouseenter', (c) => {
            Cursor.onMouseEnter(new Cursor.CursorInfo(c.offsetX, c.offsetY, false, false, c.target));
        });
        element.addEventListener('mouseleave', (c) => {
            Cursor._prop.active = false;
            Cursor.onMouseLeave(new Cursor.CursorInfo(c.offsetX, c.offsetY, false, false, c.target));
        });
        element.addEventListener('mousedown', (c) => {
            Cursor._prop.active = true;
            Cursor._prop.start_x = c.offsetX;
            Cursor._prop.start_y = c.offsetY;
            Cursor.onMouseDown(new Cursor.CursorInfo(c.offsetX, c.offsetY, c.button == 0, c.button == 2, c.target));
        });
        element.addEventListener('mouseup', (c) => {
            Cursor._prop.active = false;
            Cursor.onMouseUp(new Cursor.CursorInfo(c.offsetX, c.offsetY, c.button == 0, c.button == 2, c.target));
        });
    }
}