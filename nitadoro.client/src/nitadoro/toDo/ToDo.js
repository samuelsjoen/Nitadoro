class ToDo {
    /**
     * A class representing a to do
     */
    constructor(id, text) {
        this._id = id;
        this._text = text;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get text() {
        return this._text;
    }

    set text(text) {
        this._text = text;
    }
}

export default ToDo;