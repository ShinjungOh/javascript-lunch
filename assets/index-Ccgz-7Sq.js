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
const createHeader = ({ title }) => {
  const header = document.querySelector("header");
  const h1 = document.createElement("h1");
  h1.classList.add("gnb__title", "text-title");
  h1.textContent = title;
  header == null ? void 0 : header.appendChild(h1);
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("gnb__button");
  button.innerHTML = `<img src="images/add-button.png" alt="음식점 추가" />`;
  header == null ? void 0 : header.appendChild(button);
  return header;
};
const createTab = ({ title, subTitle }) => {
  const tabContainer = document.createElement("div");
  tabContainer.classList.add("tab");
  const mainTitle = document.createElement("h2");
  mainTitle.textContent = title;
  mainTitle.classList.add("tab__title");
  const subTitleEl = document.createElement("h2");
  subTitleEl.textContent = subTitle;
  subTitleEl.classList.add("tab__subTitle");
  tabContainer.append(mainTitle, subTitleEl);
  return tabContainer;
};
const ERROR_MESSAGE = {
  restaurantNameMinLength: "이름은 최소 1글자 이상 가능합니다.",
  restaurantNameMaxLength: "이름은 최대 20글자까지 가능합니다.",
  duplicateRestaurantName: "기존에 있는 식당과 중복된 이름입니다.",
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
const createRestaurantItem = ({
  id,
  category,
  name,
  distance,
  description,
  isFavorite
}) => {
  if (!id) {
    throw new Error("id가 없습니다.");
  }
  const li = document.createElement("li");
  li.classList.add("restaurant");
  li.id = id;
  const mappedImage = IMAGE_SRC_BY_RESTAURANTS_CATEGORY[category];
  const favoriteIconSrc = isFavorite ? "images/favorite-icon-filled.png" : "images/favorite-icon-lined.png";
  li.innerHTML = `<div class="restaurant__category">
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
  return li;
};
const createModal = ({ id, title, content, options }) => {
  var _a;
  const modal = document.createElement("dialog");
  modal.classList.add("modal");
  modal.id = id;
  const modalHTML = `
    <div class="modal-container">
      ${title ? `<h2 class="modal-title text-title">${title}</h2>` : ""}
      <div class="modal-content">
        ${content}
      </div>
      ${options ? `<div class="modal-footer">
        <div class="button-container">
          <button type="button" id="modal-close-btn" class="button button--secondary text-caption">${options == null ? void 0 : options.close.label}</button>
          <button type="button" id="modal-submit-btn" class="button button--primary text-caption">${options == null ? void 0 : options.submit.label}</button>
        </div>
      </div>` : ""}
    </div>
  `;
  modal.innerHTML = modalHTML;
  (_a = document.querySelector("body")) == null ? void 0 : _a.append(modal);
  const closeButton = modal.querySelector("#modal-close-btn");
  const submitButton = modal.querySelector("#modal-submit-btn");
  closeButton == null ? void 0 : closeButton.addEventListener("click", () => {
    options == null ? void 0 : options.close.onClick();
    modal.close();
    console.log("modal close");
  });
  submitButton == null ? void 0 : submitButton.addEventListener("click", () => {
    options == null ? void 0 : options.submit.onClick();
    modal.close();
    console.log("modal close");
  });
  modal.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.closest(".modal-container")) {
      modal.close();
      options == null ? void 0 : options.close.onClick();
    }
  });
  return modal;
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
  const localStorageRestaurantData = localStorageUtils.get("restaurants") || [];
  if (localStorageRestaurantData.length === 0) {
    const initialRestaurantsData = restaurantsData.map((restaurant) => {
      const id = getUniqueRestaurantId();
      return {
        ...restaurant,
        id,
        isFavorite: false
      };
    });
    localStorageUtils.set("restaurants", initialRestaurantsData);
  }
  return localStorageRestaurantData;
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
  localStorageRestaurantData.push(restaurant);
  localStorageUtils.set("restaurants", localStorageRestaurantData);
};
const deleteRestaurant = (id) => {
  const localStorageRestaurantData = localStorageUtils.get("restaurants") || [];
  const filteredRestaurantData = localStorageRestaurantData.filter(
    (restaurant) => restaurant.id !== id
  );
  localStorageUtils.set("restaurants", filteredRestaurantData);
};
const toggleFavoriteRestaurant = (id) => {
  if (!id) {
    return;
  }
  const localStorageRestaurantData = localStorageUtils.get("restaurants") || [];
  const toggledRestaurantData = localStorageRestaurantData.map(
    (restaurant) => {
      if (restaurant.id === id) {
        return {
          ...restaurant,
          isFavorite: !restaurant.isFavorite
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
const renderRestaurantList = (restaurants, setRestaurant, el) => {
  let localRestaurants = restaurants;
  const handleFavorite = (id) => {
    const updatedRestaurants = localRestaurants.map(
      (restaurant) => restaurant.id === id ? { ...restaurant, isFavorite: !restaurant.isFavorite } : restaurant
    );
    restaurantManager.toggleFavorite(id);
    setRestaurant(updatedRestaurants);
    localRestaurants = updatedRestaurants;
    render(localRestaurants);
  };
  const handleDelete = (id) => {
    const updatedRestaurants = localRestaurants.filter(
      (restaurant) => restaurant.id !== id
    );
    restaurantManager.delete(id);
    setRestaurant(updatedRestaurants);
    localRestaurants = updatedRestaurants;
    render(localRestaurants);
  };
  const render = (restaurants2) => {
    if (el) {
      el.innerHTML = "";
    }
    restaurants2.forEach((restaurant) => {
      const restaurantItem = createRestaurantItem(restaurant);
      restaurantItem.addEventListener("click", (e) => {
        if (e.target instanceof HTMLImageElement && e.target.classList.contains("favorite-icon")) {
          handleFavorite(restaurant.id);
          return;
        }
        showRestaurantDetail(restaurant, handleDelete, handleFavorite);
      });
      el == null ? void 0 : el.appendChild(restaurantItem);
    });
  };
  render(localRestaurants);
};
const showRestaurantDetail = (restaurant, onDelete, onFavorite) => {
  var _a;
  const mappedImage = IMAGE_SRC_BY_RESTAURANTS_CATEGORY[restaurant.category];
  const isFavorite = restaurant.isFavorite;
  const isFavoriteIconSrc = isFavorite ? "images/favorite-icon-filled.png" : "images/favorite-icon-lined.png";
  const restaurantDetailContent = `
  <div class="detail-modal-content" data-id="${restaurant.id}">
    <div class="detail-modal-header">
      <img src="${isFavoriteIconSrc}" alt="즐겨찾기" class="favorite-icon" data-id="${restaurant.id}" data-favorite="${isFavorite}" />
      <div class="detail-modal-category">
        <img src="${mappedImage}" alt="${restaurant.category}" />
      </div>
      <div class="detail-modal-info">
        <h3 class="detail-modal-title">${restaurant.name}</h3>
        <span class="detail-modal-distance">캠퍼스로부터 ${restaurant.distance}분 내</span>
      </div>
    </div>
    <p class="detail-modal-description">${restaurant.description ?? ""}</p>
    ${restaurant.link ? `<p class="detail-modal-link">
            <a href="${restaurant.link}" target="_blank">${restaurant.link}</a>
           </p>` : ""}
  </div>
`;
  const detailModal = createModal({
    id: "restaurant-detail-dialog",
    content: restaurantDetailContent,
    options: {
      close: {
        label: "닫기",
        onClick: () => {
          detailModal.close();
        }
      },
      submit: {
        label: "삭제하기",
        onClick: () => {
          if (!(restaurant == null ? void 0 : restaurant.id)) {
            throw new Error("음식점 ID가 존재하지 않습니다.");
          }
          onDelete(restaurant.id);
        }
      }
    }
  });
  (_a = document.body) == null ? void 0 : _a.append(detailModal);
  detailModal.showModal();
  const modalFavoriteIcon = detailModal.querySelector(".favorite-icon");
  if (modalFavoriteIcon instanceof HTMLImageElement) {
    modalFavoriteIcon.addEventListener("click", (e) => {
      const target = e.currentTarget;
      const currentFavorite = target.dataset.favorite === "true";
      const toggledFavorite = !currentFavorite;
      const newSrc = toggledFavorite ? "images/favorite-icon-filled.png" : "images/favorite-icon-lined.png";
      target.setAttribute("src", newSrc);
      target.dataset.favorite = String(toggledFavorite);
      onFavorite(restaurant.id);
    });
  }
};
const createForm = () => {
  const html = `
  <form>
      <div class="form-item form-item--required">
        <label for="category" class="text-caption">카테고리</label>
        <select name="category" id="category" required>
          <option value="">선택해 주세요</option>
          <option value="한식">한식</option>
          <option value="중식">중식</option>
          <option value="일식">일식</option>
          <option value="양식">양식</option>
          <option value="아시안">아시안</option>
          <option value="기타">기타</option>
        </select>
      </div>
  
      <div class="form-item form-item--required">
        <label for="name" class="text-caption">이름</label>
        <input type="text" name="name" id="name" required />
      </div>
  
      <div class="form-item form-item--required">
        <label for="distance" class="text-caption">거리(도보 이동 시간)</label>
        <select name="distance" id="distance" required>
          <option value="">선택해 주세요</option>
          <option value="5">5분 내</option>
          <option value="10">10분 내</option>
          <option value="15">15분 내</option>
          <option value="20">20분 내</option>
          <option value="30">30분 내</option>
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
  if (newRestaurant.description.length > VALIDATE_SETTINGS.descriptionMaxLength) {
    return ERROR_MESSAGE.descriptionMaxLength;
  }
  return null;
};
const state = {
  category: "전체",
  sortType: "name",
  restaurants: []
};
const setStateRestaurant = (restaurants) => {
  state.restaurants = restaurants;
};
document.addEventListener("DOMContentLoaded", () => {
  state.restaurants = restaurantManager.getInitialData();
  const body = document.querySelector("body");
  const header = createHeader({ title: "점심 뭐 먹지" });
  const categoryFilter = body == null ? void 0 : body.querySelector("#category-filter");
  const sortingFilter = body == null ? void 0 : body.querySelector("#sorting-filter");
  const restaurantList = document.querySelector(".restaurant-list");
  categoryFilter == null ? void 0 : categoryFilter.addEventListener("change", (e) => {
    const target = e.target;
    const value = target.value;
    state.category = value;
    if (!restaurantList) {
      throw new Error("음식점 목록을 찾을 수 없습니다.");
    }
    const filterRestaurants = restaurantManager.getFilterAndSortList(
      state.restaurants,
      value,
      state.sortType
    );
    renderRestaurantList(filterRestaurants, setStateRestaurant, restaurantList);
  });
  sortingFilter == null ? void 0 : sortingFilter.addEventListener("change", (e) => {
    const target = e.target;
    const value = target.value;
    if (!restaurantList) {
      throw new Error("음식점 목록을 찾을 수 없습니다.");
    }
    state.sortType = value;
    const filterRestaurants = restaurantManager.getFilterAndSortList(
      state.restaurants,
      state.category,
      value
    );
    renderRestaurantList(filterRestaurants, setStateRestaurant, restaurantList);
  });
  const tab = createTab({
    title: "모든 음식점",
    subTitle: "자주 가는 음식점"
  });
  header == null ? void 0 : header.after(tab);
  const mainTab = tab.querySelector(".tab__title");
  const subTab = tab.querySelector(".tab__subTitle");
  const restaurantFilterContainer = document.querySelector(
    ".restaurant-filter-container"
  );
  mainTab == null ? void 0 : mainTab.classList.add("active");
  mainTab == null ? void 0 : mainTab.addEventListener("click", () => {
    mainTab.classList.add("active");
    subTab == null ? void 0 : subTab.classList.remove("active");
    if (!restaurantList) {
      throw new Error("음식점 목록을 찾을 수 없습니다.");
    }
    renderRestaurantList(state.restaurants, setStateRestaurant, restaurantList);
    restaurantFilterContainer == null ? void 0 : restaurantFilterContainer.classList.remove("hidden");
  });
  subTab == null ? void 0 : subTab.addEventListener("click", () => {
    subTab.classList.add("active");
    mainTab == null ? void 0 : mainTab.classList.remove("active");
    const restaurants = restaurantManager.getFavoriteList(
      state.restaurants
    );
    if (!restaurantList) {
      throw new Error("음식점 목록을 찾을 수 없습니다.");
    }
    renderRestaurantList(restaurants, setStateRestaurant, restaurantList);
    restaurantFilterContainer == null ? void 0 : restaurantFilterContainer.classList.add("hidden");
  });
  const handleFormSubmit = () => {
    const addRestaurantDialogElement = document.getElementById(
      "restaurant-add-dialog"
    );
    if (!addRestaurantDialogElement) {
      throw new Error("다이얼로그 요소를 찾을 수 없습니다.");
    }
    const nameInput = addRestaurantDialogElement.querySelector("#name");
    const descriptionInput = addRestaurantDialogElement.querySelector(
      "#description"
    );
    const categoryInput = addRestaurantDialogElement.querySelector("#category");
    const distanceInput = addRestaurantDialogElement.querySelector("#distance");
    const linkInput = addRestaurantDialogElement.querySelector("#link");
    const restaurantsNameList = state.restaurants.map(
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
    const errorMessage = validateRestaurant(newRestaurant, restaurantsNameList);
    if (errorMessage) {
      alert(errorMessage);
      return;
    }
    const restaurantItem = createRestaurantItem(newRestaurant);
    restaurantList == null ? void 0 : restaurantList.appendChild(restaurantItem);
    restaurantManager.add(newRestaurant);
    formReset();
  };
  const formContent = createForm();
  const formReset = () => {
    const addRestaurantForm = document.querySelector(
      "#restaurant-add-dialog form"
    );
    addRestaurantForm == null ? void 0 : addRestaurantForm.reset();
  };
  const addRestaurantModal = createModal({
    id: "restaurant-add-dialog",
    title: "새로운 음식점",
    content: formContent,
    options: {
      close: {
        label: "취소하기",
        onClick: () => {
          formReset();
        }
      },
      submit: {
        label: "추가하기",
        onClick: handleFormSubmit
      }
    }
  });
  const addRestaurantModalButton = header == null ? void 0 : header.querySelector(".gnb__button");
  addRestaurantModalButton == null ? void 0 : addRestaurantModalButton.addEventListener("click", () => {
    addRestaurantModal.showModal();
  });
  if (restaurantList) {
    renderRestaurantList(state.restaurants, setStateRestaurant, restaurantList);
  }
});
