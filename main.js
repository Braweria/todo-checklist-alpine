import Alpine from "alpinejs";

window.Alpine = Alpine;

const STORAGE_ITEMS_KEY = "checklist-items";
const STORAGE_TRASH_KEY = "checklist-items-trash";

function createItem(name) {
  return {
    name,
    completed: false,
    id: Math.round(Date.now() + Math.random()),
  };
}

Alpine.data("checklist", () => ({
  item: "",
  items: [],
  trash: [],
  showTrash: false,
  filtered: [],

  init() {
    const storedItems = JSON.parse(localStorage.getItem(STORAGE_ITEMS_KEY));
    if (storedItems) {
      this.items = storedItems;
    }
    const storedTrashedItems = JSON.parse(
      localStorage.getItem(STORAGE_TRASH_KEY)
    );
    if (storedTrashedItems) {
      this.trash = storedTrashedItems;
    }

    this.$watch("items", (value) => {
      localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(value));
    });

    this.$watch("trash", (value) => {
      console.log(value);
      localStorage.setItem(STORAGE_TRASH_KEY, JSON.stringify(value));
    });
  },

  add() {
    if (this.item) {
      this.items.push(createItem(this.item));
      this.item = "";
    }
  },

  remove(id) {
    const index = this.items.findIndex((item) => item.id === id);
    this.trash.push(this.items[index]);
    this.items.splice(index, 1);
  },

  toggleTrash() {
    this.showTrash = !this.showTrash;
  },

  restore(id) {
    const index = this.trash.findIndex((item) => item.id === id);
    this.items.push(this.trash[index]);
    this.trash.splice(index, 1);
  },

  deleteForever(id) {
    this.trash = this.trash.filter((item) => item.id !== id);
  },
}));

Alpine.start();
