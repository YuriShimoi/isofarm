class Memory {
    static hasSave() {
        return true;
    }

    static load() {

    }
}

class MemoryTraceable {
    static track(__obj__) {

    }

    static saveObject(__obj__) {
        __obj__.name;
        __obj__.prop;
        __obj__.value;
    }
}


class Exemplo extends MemoryTraceable {
    static coins;

    constructor() {
        super();
        coins = 5;
    }
}
MemoryTraceable.track(Exemplo);


Exemplo.coins = 7;