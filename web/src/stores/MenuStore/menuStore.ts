import { action, makeObservable, observable } from "mobx";

export class MenuStore {
    constructor() {
        makeObservable(this);
    }

    @observable
    selectedPage: string = "home";

    @action
    setSelectedPage(page: string) {
        console.log("MenuStore: Setting page to", page);
        this.selectedPage = page;
    }

    get getSelectedPage() {
        return this.selectedPage;
    }
}

export const menuStore = new MenuStore();
