(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const $ = (selector) => document.querySelector(selector);
const createElement = (tagName, attributes = {}) => {
  var _a;
  const $el = document.createElement(tagName);
  ((_a = attributes.class) == null ? void 0 : _a.length) && $el.classList.add(...attributes.class);
  delete attributes.class;
  attributes.textContent && ($el.textContent = attributes.textContent);
  delete attributes.textContent;
  attributes.innerHTML && ($el.innerHTML = String(attributes.innerHTML));
  delete attributes.innerHTML;
  Object.entries(attributes).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      $el.addEventListener(eventName, value);
      return;
    }
    if (value != null) {
      $el.setAttribute(key, String(value));
    }
  });
  return $el;
};
const createHeader = ({ title }) => {
  const $header = $("header");
  const $headerTitle = createElement("h1", {
    class: ["gnb__title", "text-title"],
    textContent: title
  });
  $header == null ? void 0 : $header.appendChild($headerTitle);
  const $button = createElement("button", {
    type: "button",
    class: ["gnb__button"],
    innerHTML: `<img src="images/add-button.png" alt="음식점 추가" />`
  });
  $header == null ? void 0 : $header.appendChild($button);
  return $header;
};
const createTab = ({ title, subTitle }) => {
  const $tabContainer = createElement("div", {
    class: ["tab"]
  });
  const $mainTitle = createElement("h2", {
    class: ["tab__title"],
    textContent: title
  });
  const $subTitleEl = createElement("h2", {
    class: ["tab__subTitle"],
    textContent: subTitle
  });
  $tabContainer.append($mainTitle, $subTitleEl);
  return $tabContainer;
};
const ERROR_MESSAGE = {
  restaurantNameMinLength: "이름은 최소 1글자 이상 가능합니다.",
  restaurantNameMaxLength: "이름은 최대 20글자까지 가능합니다.",
  duplicateRestaurantName: "기존에 있는 식당과 중복된 이름입니다.",
  emptyCategory: "카테고리를 선택해주세요.",
  emptyDistance: "거리를 선택해주세요.",
  descriptionMaxLength: "설명은 최대 500글자까지 가능합니다."
};
const IMAGE_SRC_BY_RESTAURANTS_CATEGORY = {
  전체: "",
  한식: "images/category-korean.png",
  중식: "images/category-chinese.png",
  일식: "images/category-japanese.png",
  양식: "images/category-western.png",
  아시안: "images/category-asian.png",
  기타: "images/category-etc.png"
};
const VALIDATE_SETTINGS = {
  nameMinLength: 1,
  nameMaxLength: 20,
  descriptionMaxLength: 500
};
const CATEGORY_OPTIONS = [
  "한식",
  "중식",
  "일식",
  "양식",
  "아시안",
  "기타"
];
const DISTANCE_OPTIONS = ["5", "10", "15", "20", "30"];
const RestaurantItem = ({
  restaurantItem,
  onFavorite,
  onShowDetail
}) => {
  const { id, category, name, distance, description, isFavorite } = restaurantItem;
  if (!id) {
    throw new Error("id가 없습니다.");
  }
  const $li = createElement("li", {
    class: ["restaurant"],
    id
  });
  const mappedImage = IMAGE_SRC_BY_RESTAURANTS_CATEGORY[category];
  const favoriteIconSrc = isFavorite ? "images/favorite-icon-filled.png" : "images/favorite-icon-lined.png";
  $li.innerHTML = `
    <div class="restaurant__category">
      <img src="${mappedImage}" alt="${category}" class="category-icon" />
    </div>
    <div class="restaurant__info">
      <div class="restaurant__header">
        <div class="restaurant__title">  
          <h3 class="restaurant__name text-subtitle">${name}</h3>
            <span class="restaurant__distance text-body">캠퍼스로부터 ${distance}분 내</span>
        </div>
        <img src="${favoriteIconSrc}" alt="즐겨찾기" class="favorite-icon" data-id="${id}" data-favorite="${isFavorite}" />
      </div>
      ${description ? `<p class="restaurant__description text-body">${description}</p>` : ""}
      </div>
    `;
  const favoriteIcon = $li.querySelector(".favorite-icon");
  if (favoriteIcon instanceof HTMLImageElement) {
    favoriteIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      const toggledIsFavorite = !isFavorite;
      onFavorite(id, toggledIsFavorite);
    });
  }
  $li.addEventListener("click", () => {
    onShowDetail(id);
  });
  return $li;
};
const Modal = ({ id, title, content, options }) => {
  const $modal = createElement("dialog", {
    class: ["modal"],
    id
  });
  const handleClickClose = () => {
    options == null ? void 0 : options.close.onClick();
    $modal.close();
  };
  const handleSubmitClick = (event) => {
    event.preventDefault();
    options == null ? void 0 : options.submit.onClick();
  };
  const handleClickBackDrop = (event) => {
    const target = event.target;
    if (!target.closest(".modal-container")) {
      options == null ? void 0 : options.close.onClick();
      $modal.close();
    }
  };
  $modal.innerHTML = `
    <div class="modal-container">
      ${title ? `<h2 class="modal-title text-title">${title}</h2>` : ""}
      <div class="modal-content">
        ${content}
      </div>
      ${options ? `<div class="modal-footer">
              <div class="button-container">
                <button type="button" id="modal-close-btn" class="button button--secondary text-caption">
                  ${options.close.label}
                </button>
                <button type="button" id="modal-submit-btn" class="button button--primary text-caption">
                  ${options.submit.label}
                </button>
              </div>
            </div>` : ""}
    </div>
  `;
  const closeButton = $modal.querySelector("#modal-close-btn");
  const submitButton = $modal.querySelector("#modal-submit-btn");
  closeButton == null ? void 0 : closeButton.addEventListener("click", handleClickClose);
  submitButton == null ? void 0 : submitButton.addEventListener("click", handleSubmitClick);
  $modal.addEventListener("click", handleClickBackDrop);
  return $modal;
};
const MODAL_ID$1 = "restaurant-detail-dialog";
const RestaurantDetailModal = (restaurant, onDelete, onFavorite) => {
  if (!restaurant.id) return;
  const $existingModal = $(`#${MODAL_ID$1}`);
  if ($existingModal) {
    $existingModal.remove();
  }
  const mappedImage = IMAGE_SRC_BY_RESTAURANTS_CATEGORY[restaurant.category];
  const createDetailContent = (currentRestaurant) => {
    const isFavorite = currentRestaurant.isFavorite;
    const isFavoriteIconSrc = isFavorite ? "images/favorite-icon-filled.png" : "images/favorite-icon-lined.png";
    return `
      <div class="detail-modal-content" data-id="${currentRestaurant.id}">
        <div class="detail-modal-header">
          <img src="${isFavoriteIconSrc}" alt="즐겨찾기" class="favorite-icon" data-id="${currentRestaurant.id}" data-favorite="${isFavorite}" />
          <div class="detail-modal-category">
            <img src="${mappedImage}" alt="${currentRestaurant.category}" />
          </div>
          <div class="detail-modal-info">
            <h3 class="detail-modal-title">${currentRestaurant.name}</h3>
            <span class="detail-modal-distance">캠퍼스로부터 ${currentRestaurant.distance}분 내</span>
          </div>
        </div>
        <p class="detail-modal-description">${currentRestaurant.description ?? ""}</p>
        ${currentRestaurant.link ? `<p class="detail-modal-link">
                <a href="${currentRestaurant.link}" target="_blank">${currentRestaurant.link}</a>
              </p>` : ""}
      </div>
    `;
  };
  const restaurantDetailContent = createDetailContent(restaurant);
  const $detailModal = Modal({
    id: MODAL_ID$1,
    content: restaurantDetailContent,
    options: {
      close: {
        label: "닫기",
        onClick: () => $detailModal.close()
      },
      submit: {
        label: "삭제하기",
        onClick: () => {
          if (!restaurant.id) return;
          onDelete(restaurant.id);
          $detailModal.close();
        }
      }
    }
  });
  const setupFavoriteIcon = () => {
    const modalFavoriteIcon = $detailModal.querySelector(".favorite-icon");
    if (modalFavoriteIcon instanceof HTMLImageElement) {
      modalFavoriteIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!restaurant.id) return;
        const isFavorite = modalFavoriteIcon.dataset.favorite === "true";
        const toggledIsFavorite = !isFavorite;
        modalFavoriteIcon.src = toggledIsFavorite ? "images/favorite-icon-filled.png" : "images/favorite-icon-lined.png";
        modalFavoriteIcon.dataset.favorite = String(toggledIsFavorite);
        onFavorite(restaurant.id, toggledIsFavorite);
      });
    }
  };
  const body = $("body");
  if (body) {
    body.append($detailModal);
    setupFavoriteIcon();
    $detailModal.showModal();
  }
};
const restaurantsData = [
  {
    category: "한식",
    name: "불고기 정식",
    distance: 10,
    description: "신선한 재료로 만든 불고기와 다양한 반찬이 제공되는 한식당.",
    isFavorite: false
  },
  {
    category: "한식",
    name: "김치찌개 명가",
    distance: 30,
    description: "전통 방식으로 끓인 깊은 맛의 김치찌개를 맛볼 수 있는 곳.",
    isFavorite: false
  },
  {
    category: "중식",
    name: "짜장면 명가",
    distance: 5,
    description: "깊은 맛의 짜장면과 함께 신선한 만두를 즐길 수 있는 중식당.",
    isFavorite: false
  },
  {
    category: "중식",
    name: "짬뽕과 탕수육",
    distance: 10,
    description: "매콤한 짬뽕과 바삭한 탕수육을 함께 맛볼 수 있는 중식 레스토랑.",
    isFavorite: false
  },
  {
    category: "일식",
    name: "스시야",
    distance: 5,
    description: "신선한 해산물로 만든 스시와 사시미가 일품인 일식당.",
    isFavorite: false
  },
  {
    category: "일식",
    name: "라멘집",
    distance: 15,
    description: "진한 국물과 쫄깃한 면발이 특징인 라멘 전문점.",
    isFavorite: false
  },
  {
    category: "양식",
    name: "파스타 하우스",
    distance: 10,
    description: "다양한 소스와 알단테 파스타를 즐길 수 있는 양식 레스토랑.",
    isFavorite: false
  },
  {
    category: "양식",
    name: "피자 플라자",
    distance: 20,
    description: "바삭한 도우와 풍부한 토핑이 매력적인 피자 전문점.",
    isFavorite: false
  },
  {
    category: "아시안",
    name: "팟타이 하우스",
    distance: 5,
    description: "태국의 대표 요리 팟타이를 전문으로 하는 레스토랑.",
    isFavorite: false
  },
  {
    category: "아시안",
    name: "쌀국수 하우스",
    distance: 30,
    description: "풍미 가득한 국물과 쫄깃한 면발의 쌀국수를 즐길 수 있는 곳.",
    isFavorite: false
  },
  {
    category: "기타",
    name: "도스타코스",
    distance: 5,
    description: "독특한 분위기와 다양한 메뉴로 인기 있는 그릴 레스토랑.",
    isFavorite: false
  },
  {
    category: "기타",
    name: "멕시칸 스트리트",
    distance: 10,
    description: "다양한 멕시칸 요리를 즐길 수 있는 캐주얼 레스토랑.",
    isFavorite: false
  }
];
const getLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    return null;
  }
  return null;
};
const setLocalStorage = (key, value) => {
  if (typeof window !== "undefined") {
    try {
      const jsonStringifyValue = JSON.stringify(value);
      localStorage.setItem(key, jsonStringifyValue);
    } catch (error) {
      console.error(error);
    }
  }
};
const removeLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
const clearLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
};
const localStorageUtils = {
  get: getLocalStorage,
  set: setLocalStorage,
  remove: removeLocalStorage,
  clear: clearLocalStorage
};
const getUniqueRestaurantId = () => {
  const randomId = Math.floor(Math.random() * 1e6);
  return `restaurant-${randomId}`;
};
const getInitialLoadRestaurantData = () => {
  if (typeof window === "undefined") {
    return [];
  }
  const localData = localStorageUtils.get("restaurants");
  if (localData && localData.length > 0) {
    return localData;
  } else {
    const initialRestaurantsData = restaurantsData.map((restaurant) => {
      const id = getUniqueRestaurantId();
      return { ...restaurant, id, isFavorite: false };
    });
    localStorageUtils.set("restaurants", initialRestaurantsData);
    return initialRestaurantsData;
  }
};
const getFavoriteRestaurants = (restaurants) => {
  return restaurants.filter((restaurant) => restaurant.isFavorite);
};
const getFilterAndSortRestaurants = (restaurants, category, sortType) => {
  return restaurants.filter((restaurant) => {
    if (category === "전체") {
      return true;
    }
    return category === restaurant.category;
  }).sort((a, b) => {
    if (sortType === "name") {
      return a.name.localeCompare(b.name);
    }
    return a.distance - b.distance;
  });
};
const addRestaurant = (restaurant) => {
  const localStorageRestaurantData = localStorageUtils.get("restaurants") || [];
  localStorageUtils.set("restaurants", [
    ...localStorageRestaurantData,
    restaurant
  ]);
};
const deleteRestaurant = (id) => {
  const localStorageRestaurantData = localStorageUtils.get("restaurants") || [];
  const filteredRestaurantData = localStorageRestaurantData.filter(
    (restaurant) => restaurant.id !== id
  );
  localStorageUtils.set("restaurants", filteredRestaurantData);
};
const toggleFavoriteRestaurant = (id, isFavorite) => {
  const localStorageRestaurantData = localStorageUtils.get("restaurants") || [];
  const toggledRestaurantData = localStorageRestaurantData.map(
    (restaurant) => {
      if (restaurant.id === id) {
        return {
          ...restaurant,
          isFavorite
        };
      }
      return restaurant;
    }
  );
  localStorageUtils.set("restaurants", toggledRestaurantData);
};
const restaurantManager = {
  getUniqueId: getUniqueRestaurantId,
  getInitialData: getInitialLoadRestaurantData,
  getFavoriteList: getFavoriteRestaurants,
  getFilterAndSortList: getFilterAndSortRestaurants,
  add: addRestaurant,
  delete: deleteRestaurant,
  toggleFavorite: toggleFavoriteRestaurant
};
const RestaurantList = ({
  restaurants,
  setRestaurant,
  el,
  filter
}) => {
  const render = () => {
    const displayRestaurants = filter.tab === "자주 가는 음식점" ? restaurantManager.getFavoriteList(restaurants) : restaurantManager.getFilterAndSortList(
      restaurants,
      filter.category,
      filter.sortType
    );
    const fragment = document.createDocumentFragment();
    displayRestaurants.forEach((restaurant) => {
      const restaurantItem = RestaurantItem({
        restaurantItem: restaurant,
        onFavorite: handleFavorite,
        onShowDetail: handleShowDetail
      });
      fragment.appendChild(restaurantItem);
    });
    el.replaceChildren(fragment);
  };
  const handleFavorite = (id, isFavorite) => {
    const targetRestaurant = restaurants.find(
      (restaurant) => restaurant.id === id
    );
    if (!targetRestaurant) return;
    const updatedRestaurants = restaurants.map((restaurant) => {
      if (restaurant.id === id) {
        return {
          ...restaurant,
          isFavorite
        };
      }
      return restaurant;
    });
    restaurantManager.toggleFavorite(id, isFavorite);
    setRestaurant(updatedRestaurants);
  };
  const handleDelete = (id) => {
    const updatedRestaurants = restaurants.filter(
      (restaurant) => restaurant.id !== id
    );
    restaurantManager.delete(id);
    setRestaurant(updatedRestaurants);
  };
  const handleShowDetail = (id) => {
    const targetRestaurant = restaurants.find(
      (restaurant) => restaurant.id === id
    );
    if (!targetRestaurant) return;
    RestaurantDetailModal(targetRestaurant, handleDelete, handleFavorite);
  };
  render();
};
const RestaurantForm = () => {
  const getCategoryOptions = () => {
    return `<option value="">선택해 주세요</option>
              ${CATEGORY_OPTIONS.map(
      (option) => `<option value="${option}">${option}</option>`
    ).join("")}
            `;
  };
  const getDistanceOptions = () => {
    return `<option value="">선택해 주세요</option>
              ${DISTANCE_OPTIONS.map(
      (option) => `<option value="${option}">${option}분 내</option>`
    ).join("")}
            `;
  };
  const html = `
  <form>
      <div class="form-item form-item--required">
        <label for="category" class="text-caption">카테고리</label>
        <select name="category" id="category" required>
         ${getCategoryOptions()}
        </select>
      </div>
  
      <div class="form-item form-item--required">
        <label for="name" class="text-caption">이름</label>
        <input type="text" name="name" id="name" required />
      </div>
  
      <div class="form-item form-item--required">
        <label for="distance" class="text-caption">거리(도보 이동 시간)</label>
        <select name="distance" id="distance" required>
         ${getDistanceOptions()}
        </select>
      </div>
  
      <div class="form-item">
        <label for="description" class="text-caption">설명</label>
        <textarea name="description" id="description" cols="30" rows="5"></textarea>
        <span class="help-text text-caption">메뉴 등 추가 정보를 입력해 주세요.</span>
      </div>
  
      <div class="form-item">
        <label for="link" class="text-caption">참고 링크</label>
        <input type="url" name="link" id="link" />
        <span class="help-text text-caption">매장 정보를 확인할 수 있는 링크를 입력해 주세요.</span>
      </div>
      </form>
  `;
  return html;
};
const validateRestaurant = (newRestaurant, restaurantNames) => {
  if (newRestaurant.name.length < VALIDATE_SETTINGS.nameMinLength) {
    return ERROR_MESSAGE.restaurantNameMinLength;
  }
  if (newRestaurant.name.length > VALIDATE_SETTINGS.nameMaxLength) {
    return ERROR_MESSAGE.restaurantNameMaxLength;
  }
  if (restaurantNames.includes(newRestaurant.name)) {
    return ERROR_MESSAGE.duplicateRestaurantName;
  }
  if (newRestaurant.category === "") {
    return ERROR_MESSAGE.emptyCategory;
  }
  if (newRestaurant.distance === 0) {
    return ERROR_MESSAGE.emptyDistance;
  }
  if (newRestaurant.description.length > VALIDATE_SETTINGS.descriptionMaxLength) {
    return ERROR_MESSAGE.descriptionMaxLength;
  }
  return null;
};
const MODAL_ID = "restaurant-add-dialog";
const RestaurantAddModal = ({
  restaurants,
  onAddRestaurant
}) => {
  const $existingModal = $(`#${MODAL_ID}`);
  if ($existingModal) {
    $existingModal.remove();
  }
  const resetForm = ($form) => {
    if (!$form) {
      return;
    }
    $form.reset();
  };
  const submitForm = ($modal2) => {
    const nameInput = $modal2.querySelector("#name");
    const descriptionInput = $modal2.querySelector("#description");
    const categoryInput = $modal2.querySelector("#category");
    const distanceInput = $modal2.querySelector("#distance");
    const linkInput = $modal2.querySelector("#link");
    const restaurantsNameList = restaurants.map(
      (restaurant) => restaurant.name
    );
    if (!nameInput || !descriptionInput || !categoryInput || !distanceInput || !linkInput) {
      throw new Error("필요한 입력 요소 중 하나 이상을 찾을 수 없습니다.");
    }
    const newRestaurant = {
      id: restaurantManager.getUniqueId(),
      category: categoryInput.value,
      name: nameInput.value,
      distance: Number(distanceInput.value),
      description: descriptionInput.value,
      link: linkInput.value,
      isFavorite: false
    };
    try {
      const errorMessage = validateRestaurant(
        newRestaurant,
        restaurantsNameList
      );
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      const updatedRestaurants = [...restaurants, newRestaurant];
      restaurantManager.add(newRestaurant);
      onAddRestaurant(updatedRestaurants);
      const $form = $modal2.querySelector("form");
      resetForm($form);
      $modal2.close();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };
  const $modal = Modal({
    id: MODAL_ID,
    title: "새로운 음식점",
    content: RestaurantForm(),
    options: {
      close: {
        label: "취소하기",
        onClick: () => {
          const $form = $modal.querySelector("form");
          resetForm($form);
        }
      },
      submit: {
        label: "추가하기",
        onClick: () => {
          submitForm($modal);
        }
      }
    }
  });
  $modal.addEventListener("close", () => {
    const $form = $modal.querySelector("form");
    resetForm($form);
  });
  const body = $("body");
  if (body) {
    body.append($modal);
    $modal.showModal();
  }
  return $modal;
};
const state = {
  tab: "모든 음식점",
  category: "전체",
  sortType: "name",
  restaurants: []
};
const getRestaurantList = () => {
  const $el = $(".restaurant-list");
  if (!$el) {
    throw new Error("음식점 목록을 찾을 수 없습니다.");
  }
  return $el;
};
const updateRestaurantList = (restaurants) => {
  setStateRestaurant(restaurants);
  const filter = {
    tab: state.tab,
    category: state.category,
    sortType: state.sortType
  };
  try {
    const el = getRestaurantList();
    RestaurantList({
      restaurants,
      filter,
      setRestaurant: updateRestaurantList,
      el
    });
  } catch (e) {
    console.error(e);
  }
};
const setStateRestaurant = (restaurants) => {
  state.restaurants = restaurants;
};
document.addEventListener("DOMContentLoaded", () => {
  state.restaurants = restaurantManager.getInitialData();
  const $header = createHeader({ title: "점심 뭐 먹지" });
  const $categoryFilter = $("#category-filter");
  const $sortingFilter = $("#sorting-filter");
  const tab = createTab({
    title: "모든 음식점",
    subTitle: "자주 가는 음식점"
  });
  $header == null ? void 0 : $header.after(tab);
  const mainTab = tab.querySelector(".tab__title");
  const subTab = tab.querySelector(".tab__subTitle");
  const restaurantFilterContainer = $(".restaurant-filter-container");
  mainTab == null ? void 0 : mainTab.classList.add("active");
  $categoryFilter == null ? void 0 : $categoryFilter.addEventListener("change", (e) => {
    const target = e.target;
    state.category = target.value;
    updateRestaurantList(state.restaurants);
  });
  $sortingFilter == null ? void 0 : $sortingFilter.addEventListener("change", (e) => {
    const target = e.target;
    state.sortType = target.value;
    updateRestaurantList(state.restaurants);
  });
  mainTab == null ? void 0 : mainTab.addEventListener("click", () => {
    mainTab.classList.add("active");
    subTab == null ? void 0 : subTab.classList.remove("active");
    state.tab = "모든 음식점";
    updateRestaurantList(state.restaurants);
    restaurantFilterContainer == null ? void 0 : restaurantFilterContainer.classList.remove("hidden");
  });
  subTab == null ? void 0 : subTab.addEventListener("click", () => {
    subTab.classList.add("active");
    mainTab == null ? void 0 : mainTab.classList.remove("active");
    state.tab = "자주 가는 음식점";
    updateRestaurantList(state.restaurants);
    restaurantFilterContainer == null ? void 0 : restaurantFilterContainer.classList.add("hidden");
  });
  const addRestaurantModalButton = $(".gnb__button");
  addRestaurantModalButton == null ? void 0 : addRestaurantModalButton.addEventListener("click", () => {
    RestaurantAddModal({
      restaurants: state.restaurants,
      onAddRestaurant: updateRestaurantList
    });
  });
  updateRestaurantList(state.restaurants);
});
