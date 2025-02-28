import { action, makeObservable, observable } from "mobx";

export class MenuStore {
    constructor() {
        makeObservable(this);
    }

    @observable
    selectedPage: string = "teams";

    @action
    setSelectedPage(page: string) {
        this.selectedPage = page;
    }

    get getSelectedPage() {
        return this.selectedPage;
    }
}
