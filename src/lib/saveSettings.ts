import { ParamsStore } from "./searchParams";
import storage from "./localStorage";
import encrypt from "./dataEncrypt";

/**
 * the settings params store class, extends the params store class
 */
export class SettingsParamsStore extends ParamsStore {
    store() {
        this.compareWithLocalStorage();

        return {
            ...new ParamsStore().store(),
            panicKey: this.url().get("panickey") || String(null),
            disguise: this.url().get("disguise") || String(-1)
        };
    }
};

const settingsParamsStore = new SettingsParamsStore();

/**
 * the type of the settings params store class
 */
export type SettingsParams = typeof settingsParamsStore.store;

const encryptedID = encrypt().toString() as any;
const date = new Date().toLocaleString();

/**
 * the custom interface used for taking a snapshot of the settings for later
 */
export interface SettingsParamsSnapshot {
    id: typeof encryptedID;
    dateTime: typeof date;
};

/**
 * a widely-used utility class for performing operations with the settings
 */
export class SettingsStorage extends Storage {
    setSetting() {
        const search = new SettingsParamsStore().url(),
            searchStore = new SettingsParamsStore().store(),
            searchStoreKeys = Object.keys(searchStore),
            searchStoreValues = Object.values(Object.keys(searchStore));
    }
};

/**
 * the settings class used directly on the settings page
 */
export class Settings {
    #createBrandedBroadcast(name: any) {
        return new BroadcastChannel(
            "commander-" +
            (typeof name !== "string" ? String(name) : name)
        );
    }
}