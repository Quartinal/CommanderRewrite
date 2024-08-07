import { BroadcastChannel } from "broadcast-channel";
import storage from "./localStorage";

/**
 * the params store class
 */
class ParamsStore {
    /**
     * returns the url search params object used throughout this class
     */
    url() {
        return new URL(String(location)).searchParams;
    }

    /**
     * the key-value store of the search params used for commander's interactivity
     */
    store() {
        this.compareWithLocalStorage();

        return {
            useRammerhead: this.url().get("userammerhead") 
                || String(false),
            useScramjet: this.url().get("usescramjet") 
                || String(false),
            fineGrainedRammerheadControl: this.url().get("betterrammerhead") 
                || String(false),
            classicLayout: this.url().get("classiclayout") 
                || String(true)
        };
    }

    /**
     * compares the parameters with localstorage keys to make sure nothing overlaps
     */
    async compareWithLocalStorage() {
        const localStorageKeys = Object.keys(storage);
        const urlParams = this.store();

        for (const key of localStorageKeys) {
            if (urlParams[key as keyof typeof urlParams] === storage[key]) {
                alert(`${key} has already been set in localStorage.\n\nTo remove it, try clearing the site data.`);
                console.error(`LocalStorage key ${key} has an overlap with the current URL parameters.`);
                return;
            }
        }

        const channelName = Object.values(urlParams).join("-");
        const broadcastChannel = new BroadcastChannel(channelName);

        broadcastChannel.onmessage = event => {
            switch (event.data) {
                case "removeLocalStorageKey":
                    for (const key of localStorageKeys) {
                        if (urlParams[key as keyof typeof urlParams] === storage[key]) {
                            storage.remove(key);
                            console.log(`LocalStorage key ${key} has been removed.`);
                        }
                    }
                    break;
            }
        };

        checkOverlap();

        function checkOverlap() {
            const urlParamsSnapshot = Object.values(urlParams);

            for (const key of localStorageKeys) {
                if (urlParamsSnapshot.includes(storage[key])) {
                    alert(`${key} has already been set in localStorage. To remove it, try clearing the site data.`);
                    console.error(`LocalStorage key ${key} has an overlap with the current URL parameters.`);
                    return;
                }
            }
        };
    }
};

export { ParamsStore };