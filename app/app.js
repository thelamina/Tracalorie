// STorage Controller
const StorageController = (function () {
  return {
    storeItem: function (item) {
      let items;
      // Check if item
      if (localStorage.getItem("items") === null) {
        items = [];

        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        ocalStorage.setItem("items", JSON.stringify(items));
      }
    },

    getItemsStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },

    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },

    deleteItemFromStarage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },

    clearItemsFromStorage: function () {
      localStorage.removeItem('items');
    }
  };
})();

// Item Controller
const ItemController = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  const data = {
    items: StorageController.getItemsStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  return {
    getItems: function () {
      return data.items;
    },
    logData: function () {
      return data;
    },
    addItem: function (name, calories) {
      // Create ID
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = +calories;
      //Create new Item
      newItem = new Item(ID, name, calories);
      data.items.push(newItem);
      return newItem;
    },

    getTotalCalories: function () {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },

    getItemById: function (id) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    updateItem: function (name, calories) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = +calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function (id) {
      ids = data.items.map((item) => {
        return item.id;
      });

      // Get Index
      const index = ids.indexOf(id);

      // Remove Item
      data.items.splice(index, 1);
    },

    clearAllItems: function () {
      data.items = [];
    },
  };
  // Data Structure
})();

// UI Controller
const UIController = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: "#add-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#calories",
    totalCalories: "#total",
    updateBtn: "#update-btn",
    deleteBtn: "#delete-btn",
    backBtn: "#back-btn",
    clearBtn: "#clear",
  };

  // const EventListeners = {};

  return {
    getUISelectors: function () {
      return UISelectors;
    },

    populateItemsList: function (items) {
      let html = "";
      items.forEach((item) => {
        html += `<li id="item-${item.id}">${item.name}: <span>${item.calories} Calories</span>
                  <a href="#">edit</a>
                </li>`;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      // Show list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      li.id = `item-${item.id}`;
      li.innerHTML = `${item.name}: <span>${item.calories} Calories</span><a href="#" class="edit">edit</a>`;
      // insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },

    clearFields: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },

    showTotalCalories: function (total) {
      document.querySelector(UISelectors.totalCalories).textContent = total;
    },

    clearEditState: function () {
      UIController.clearFields();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },

    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },

    addItemToForm: function () {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemController.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemController.getCurrentItem().calories;

      UIController.showEditState();
    },

    updateItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // turn node list to array

      listItems = Array.from(listItems);
      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `${item.name}: <span>${item.calories} Calories</span><a href="#" class="edit">edit</a>`;
        }
      });
    },

    deleteListItem: function (id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },

    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems = Array.from(listItems);
      listItems.forEach((item) => {
        item.remove();
      });
    },
  };
})();

// App Controller
const App = (function (UIController, ItemController, StorageController) {
  //Load Event Listeners
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UIController.getUISelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable on enter
    document.addEventListener("keypress", (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // edit click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update Item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Delete Item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UIController.clearEditState);

    // Clear items event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItems());
  };

  // Add item Submit
  const itemAddSubmit = function (e) {
    const input = UIController.getItemInput();

    if (input.name !== "" && input.calories !== "") {
      const newItem = ItemController.addItem(input.name, input.calories);

      // Add item to the UI
      UIController.addListItem(newItem);

      // Get Total calories
      const totalCalories = ItemController.getTotalCalories();
      UIController.showTotalCalories(totalCalories);

      // Store in local storage
      StorageController.storeItem(newItem);
      UIController.clearFields(input);
    }

    e.preventDefault();
  };

  // Click edit item
  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit")) {
      // Get list item id
      const listId = e.target.parentNode.id;

      const listIdArr = listId.split("-");
      const id = +listIdArr[1];

      const ItemToEdit = ItemController.getItemById(id);
      ItemController.setCurrentItem(ItemToEdit);

      UIController.addItemToForm();
    }
    e.preventDefault();
  };

  // Update Item
  const itemUpdateSubmit = function (e) {
    // Get Item Input
    const input = UIController.getItemInput();

    // Update Item
    const updatedItem = ItemController.updateItem(input.name, input.calories);

    // Update UI
    UIController.updateItem(updatedItem);
    // Get Total calories
    const totalCalories = ItemController.getTotalCalories();
    UIController.showTotalCalories(totalCalories);
    // Update local storage
    StorageController.updateItemStorage(updatedItem);

    UIController.clearEditState();
    e.preventDefault();
  };

  // Update Item
  const itemDeleteSubmit = function (e) {
    // Get Current Item
    const currentItem = ItemController.getCurrentItem();

    ItemController.deleteItem(currentItem.id);

    UIController.deleteListItem(currentItem.id);

    // Get Total calories
    const totalCalories = ItemController.getTotalCalories();
    UIController.showTotalCalories(totalCalories);

    StorageController.deleteItemFromStarage(currentItem.id);
    UIController.clearEditState();
    e.preventDefault();
  };

  // Clear Items
  const clearAllItems = function () {
    ItemController.clearItems();

    UIController.removeItems();

    const totalCalories = ItemController.getTotalCalories();
    UIController.showTotalCalories(totalCalories);
    StorageController.clearItemsFromStorage();
    UIController.hideList();
  };

  // Public methods
  return {
    init: function () {
      UIController.clearEditState();

      // Fetch Items
      const items = ItemController.getItems();
      // check if any tems
      if (items.length === 0) {
        UIController.hideList();
      } else {
        // Populate list
        UIController.populateItemsList(items);
      }

      const totalCalories = ItemController.getTotalCalories();
      UIController.showTotalCalories(totalCalories);
      // Load event listeners
      loadEventListeners();
    },
  };
})(UIController, ItemController, StorageController);

App.init();
