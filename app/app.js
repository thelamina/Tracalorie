// STorage Controller

// Item Controller
const ItemController = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  const data = {
    items: [
      // { id: 0, name: "Steak Dinner", calories: 1200 },
      // { id: 1, name: "Spag", calories: 400 },
      // { id: 2, name: "Cookie", calories: 200 },
    ],
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
  };
  // Data Structure
})();

// UI Controller
const UIController = (function () {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: "#add-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#calories",
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
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement("li");
      li.id = `item-${item.id}`;
      li.innerHTML = `${item.name}: <span>${item.calories} Calories</span><a href="#">edit</a>`;
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
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
  };
})();

// App Controller
const App = (function (UIController, ItemController) {
  //Load Event Listeners
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UIController.getUISelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
  };

  // Add item Submit
  const itemAddSubmit = function (e) {
    const input = UIController.getItemInput();

    if (input.name !== "" && input.calories !== "") {
      const newItem = ItemController.addItem(input.name, input.calories);

      // Add item to the UI
      UIController.addListItem(newItem);
      UIController.clearFields(input);
    }

    e.preventDefault();
  };

  // Public methods
  return {
    init: function () {
      console.log("Initializing App");

      // Fetch Items
      const items = ItemController.getItems();
      // check if any tems
      if (items.length === 0) {
        UIController.hideList();
      } else {
        // Populate list

        UIController.populateItemsList(items);
      }

      // Load event listeners
      loadEventListeners();
    },
  };
})(UIController, ItemController);

App.init();
