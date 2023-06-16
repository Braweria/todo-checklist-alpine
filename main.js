import Alpine from "alpinejs";

window.Alpine = Alpine;

const STORAGE_ITEMS_KEY = "checklist-items";

function createItem(name) {
  return {
    name,
    completed: false,
    id: Date.now() + Math.random(),
  };
}
Alpine.data("checklist", () => ({
  item: "",
  items: [],
  trash: [],
  filtered: [],

  init() {
    const storedItems = JSON.parse(localStorage.getItem(STORAGE_ITEMS_KEY));
    if (storedItems) {
      this.items = storedItems;
    }

    this.$watch("items", (value) => {
      localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(value));
    });
  },

  add() {
    if (this.item) {
      this.items.push(createItem(this.item));
      this.item = "";
    }
  },

  remove(id) {
    // remove item by id and mmove it into trash
    
  }
}));

Alpine.start();
