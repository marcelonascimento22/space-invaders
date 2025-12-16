class Storege {
    constructor(prefix = "rank") {
        this.prefix = prefix;
    }

    _key(key) {
        return `${this.prefix}:${key}`;
    }

    save(key, value) {
        localStorage.setItem(this._key(key), JSON.stringify(value));
    }

    load(key) {
        const data = JSON.parse(localStorage.getItem(this._key(key)));

        if (
            data &&
            typeof data.nome === "string" &&
            typeof data.score === "number"
        ) {
            return data;
        }
        return null;
    }

    getAll() {
        const items = [];

        for (let i = 0; i < localStorage.length; i++) {
            const storageKey = localStorage.key(i);

            if (storageKey.startsWith(this.prefix + ":")) {
                const data = JSON.parse(localStorage.getItem(storageKey));
                if (data) items.push(data);
            }
        }

        return items;
    }

    remove(key) {
        localStorage.removeItem(this._key(key));
    }

    clear() {
        this.getAll().forEach((_, index) => {
            this.remove(index);
        });
    }
}

export default Storege;