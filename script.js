"use strict";

new Vue({
  el: '#catalog',
  data: {
    catalogList: JSON.parse(catalogList), // исходящий список товаров
    materialsList: JSON.parse(materialsList), // исходящий список фильтров
    favouriteList: localStorage.favouriteList ? JSON.parse(localStorage.favouriteList) : [],  // список Избранное, считывается с LocalStorage либо создаётся пустой массив
    cartList: localStorage.cartList ? JSON.parse(localStorage.cartList) : [],  // список Корзина, считывается с LocalStorage либо создаётся пустой массив
    sortingMode: 1, // идетификатор сортировки
    filterMode: [], // список применённых фильтров
    sortingAndFilterShowing: window.outerWidth >= 774, // отображение настройки сортировки и фильтра, и инициирование в зависимости от ширины экрана 
    showSelector: false // отображение списка опций выбора фильра
  },
  methods: {
    addFauvorites: function (index) {
      // добавление в избранное
      this.favouriteList.push(index);
      this.saveLocally();
    },
    removeFavourites(index) {
      // удаление из избранного
      this.favouriteList.splice(this.favouriteList.findIndex(item => item == index), 1);
      this.saveLocally();
    },
    addCart: function (index) {
      // добавление в корзину
      this.cartList.push(index);
      this.saveLocally();
    },
    removeCart(index) {
      // удаление из корзины
      this.cartList.splice(this.cartList.findIndex(item => item == index), 1);
      this.saveLocally();
    },
    saveLocally: function () {
      // сохранение корзины и избранного в LocalStorage
      localStorage.favouriteList = JSON.stringify(this.favouriteList);
      localStorage.cartList = JSON.stringify(this.cartList);
    },
    checkInCart: function (id) {
      // проверка по идентификатору есть ли в корзине данный товар
      return this.cartList.includes(id);
    },
    checkInFavourite: function (index) {
      // проверка по идентификатору есть ли в избранном данный товар
      return this.favouriteList.includes(index);
    },
    toggleFilter: function (filterId) {
      // манипулирование списком фильтра
      // индекс найденного по идентификатору порядкового номера записывается в переменную
      let toggleArrayIndex = this.filterMode.findIndex(item => item == filterId);
      if (toggleArrayIndex >= 0) {
        // удаляем соответствующий пункт фильтра если он в итоге найден
        this.filterMode.splice(toggleArrayIndex, 1);
      } else {
        // добавляем если его ранее не было
        this.filterMode.push(filterId);
      }
    },
    formatPrice(value) {
      // форматирование в денежный формат 
      // просматриваются числа, у которых есть числа после запятой
      if (value % 1 > 0) {
        let afterDot = '';
        // если оно таковое, то режем его на две части по запятой и берём первые две цифры от дробной части
        afterDot = value.toString().split('.')[1].slice(0, 2);
        // если число только с десятыми, то добавляем в конце 0 (ноль)
        if (afterDot.length == 1) {
          afterDot += '0';
        }
        return `${value.toString().split('.')[0]}.${afterDot}`;
      } else {
        return value.toString();
      }
    },
    toggleMenu: function () {
      // переключение отображения фильтров и сортировки
      this.sortingAndFilterShowing = !this.sortingAndFilterShowing;
    },
    onResize: function (event) {
      // обрабатываение изменения ширины экрана для отображения или скрытия фильтров и сортировки
      if (window.outerWidth >= 774) {
        this.sortingAndFilterShowing = true;
      }
    },
    toggleSelector: function () {
      // переключение отображения списка пунктов для фильтра
      this.showSelector = !this.showSelector;
    },
    isInFilter: function (id) {
      // проверка есть ли идентификатор фильтра в применённом фильтре
      if (this.filterMode.find(item => item == id)) {
        return true;
      } else {
        return false;
      }
    },
    findFilterName: function (id) {
      // поиска названия пункта фильтра по идентификатор в исходном списке фильтров
      let findIndicator;
      this.materialsList.forEach(item => {
        if (item.id == id) {
          findIndicator = item.name;
        }
      });
      return findIndicator;
    }
  },
  mounted() {
    //создание обработчика события изменения ширины экрана для Vue
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    //удаление обработчика события изменения ширины экрана
    window.removeEventListener('resize', this.onResize)
  },
  computed: {
    updatedList: function () {
      let list = this.catalogList;
      //применение фильтров для списка товаров
      list = list.filter(item => (this.filterMode.find(fiterItem => fiterItem == item.material)) || (this.filterMode.length == 0));
      //применение сотрировки для списка товаров
      if (this.sortingMode == 1) {
        list.sort((a, b) => {
          if (a.price.current_price < b.price.current_price) {
            return -1;
          } else if (a.price.current_price > b.price.current_price) {
            return 1;
          } else {
            return 0;
          }
        });
      } else if (this.sortingMode == 2) {
        list.sort((a, b) => {
          if (a.price.current_price < b.price.current_price) {
            return 1;
          } else if (a.price.current_price > b.price.current_price) {
            return -1;
          } else {
            return 0;
          }
        });
      }
      return list;
    }
  }
});