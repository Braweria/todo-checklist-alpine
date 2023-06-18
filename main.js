import Alpine from "alpinejs";

window.Alpine = Alpine;

const STORAGE_ITEMS_KEY = "checklist-items";

function createItem(name) {
  return {
    name,
    completed: false,
    id: Math.round(Date.now() + Math.random()),
    isTrashed: false,
  };
}

function fuzzySearch(searchTerm, item) {
  const regex = new RegExp(searchTerm.split("").join(".*"), "i");
  return regex.test(item.name);
}

Alpine.data("checklist", () => ({
  item: "",
  items: [],
  filter: "all",
  searchTerm: "",

  init() {
    const storedItems = JSON.parse(localStorage.getItem(STORAGE_ITEMS_KEY));
    if (storedItems) {
      this.items = storedItems;
      this.filtered = storedItems;
    }

    this.$watch("items", (value) => {
      localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(value));
    });

    this.$watch("searchTerm", (value) => {
      this.filter = `q:${value}`;
    });
  },

  get filteredItems() {
    if (this.filter === "completed") {
      return this.items.filter((item) => item.completed && !item.isTrashed);
    } else if (this.filter === "active") {
      return this.items.filter((item) => !item.completed && !item.isTrashed);
    } else if (this.filter === "trash") {
      return this.items.filter((item) => item.isTrashed);
    } else if (this.filter.startsWith("q:")) {
      return this.items.filter((item) => fuzzySearch(this.searchTerm, item));
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

  deleteItem(id) {
    this.items = this.items.filter((item) => item.id !== id);
  },

  // Filter commands

  applyFilter(filter) {
    this.filter = filter;
  },
}));

Alpine.start();
