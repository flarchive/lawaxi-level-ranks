export default class ThemeListState {
  constructor() {
    this.loadedIncludes = new Set();
  }

  async load(includes = []) {
    const unloadedIncludes = includes.filter(include => !this.loadedIncludes.has(include));

    if (unloadedIncludes.length === 0) {
      return Promise.resolve(app.store.all('themes'));
    }

    return app.store
      .find('themes')
      .then(val => {
        unloadedIncludes.forEach(include => this.loadedIncludes.add(include));
        return val;
      });
  }
}
