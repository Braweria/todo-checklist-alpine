import Alpine from "alpinejs";

window.Alpine = Alpine;

const STORAGE_ITEMS_KEY = "checklist-items";
const STORAGE_TRASH_KEY = "checklist-items-trash";

function createItem(name) {
  return {
    name,
    completed: false,
    id: Math.round(Date.now() + Math.random()),
    isTrashed: false,
  };
}

Alpine.data("checklist", () => ({
  item: "",
  items: [],
  filter: "all",

  init() {
    const storedItems = JSON.parse(localStorage.getItem(STORAGE_ITEMS_KEY));
    if (storedItems) {
      this.items = storedItems;
      this.filtered = storedItems;
    }

    this.$watch("items", (value) => {
      localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(value));
      console.log("items changed", value);
    });
  },

  get filteredItems() {
    if (this.filter === "completed") {
      return this.items.filter((item) => item.completed && !item.isTrashed);
    } else if (this.filter === "active") {
      return this.items.filter((item) => !item.completed && !item.isTrashed);
    } else if (this.filter === "trash") {
      return this.items.filter((item) => item.isTrashed);
    }
    return this.items.filter((item) => !item.isTrashed);
  },

  add() {
    if (this.item) {
      this.items.push(createItem(this.item));
      this.item = "";
    }
  },

  // Trash commands

  toggleTrash(id) {
    const index = this.items.findIndex((item) => item.id === id);
    this.items[index].isTrashed = !this.items[index].isTrashed;
  },

  clearTrash() {
    this.items = this.items.filter((item) => !item.isTrashed);
  },

  // Filter commands
  applyFilter(filter) {
    this.filter = filter;
  },
}));

Alpine.start();
