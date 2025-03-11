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
const ERROR_MESSAGE = {
  restaurantNameMaxLength: "이름은 최대 20글자까지 가능합니다.",
  duplicateRestaurantName: "기존에 있는 식당과 중복된 이름입니다.",
  descriptionMaxLength: "설명은 최대 500글자까지 가능합니다."
};
const IMAGE_SRC_BY_RESTAURANTS_CATEGORY = {
  한식: "images/category-korean.png",
  중식: "images/category-chinese.png",
  일식: "images/category-japanese.png",
  양식: "images/category-western.png",
  아시안: "images/category-asian.png",
  기타: "images/category-etc.png"
};
const validateRestaurant = (newRestaurant, restaurantNames) => {
  if (newRestaurant.name.length > 20) {
    return ERROR_MESSAGE.restaurantNameMaxLength;
  }
  if (restaurantNames.includes(newRestaurant.name)) {
    return ERROR_MESSAGE.duplicateRestaurantName;
  }
  if (newRestaurant.description.length > 500) {
    return ERROR_MESSAGE.descriptionMaxLength;
  }
  return null;
};
const restaurantsData = [
  {
    category: "한식",
    name: "피양콩할마니",
    distance: "캠퍼스부터 10분 내",
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳."
  },
  {
    category: "중식",
    name: "친친",
    distance: "캠퍼스부터 5분 내",
    description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과 정성으로 정통 중식의 세계를 펼쳐갑니다"
  },
  {
    category: "일식",
    name: "잇쇼우",
    distance: "캠퍼스부터 10분 내",
    description: "정통 자가제면 사누끼 우동을 제공하는 일식당. 기술은 정성을 이길 수 없다는 신념으로 모든 음식에 최선을 다합니다."
  },
  {
    category: "양식",
    name: "이태리키친",
    distance: "캠퍼스부터 20분 내",
    description: "늘 변화를 추구하는 이태리키친. 현대적인 감각의 양식 메뉴를 선보입니다."
  },
  {
    category: "아시안",
    name: "호아빈 삼성점",
    distance: "캠퍼스부터 15분 내",
    description: "푸짐한 양과 일품 국물이 매력인 쌀국수 전문점. 다양한 아시안 요리를 즐길 수 있습니다."
  },
  {
    category: "기타",
    name: "도스타코스 선릉점",
    distance: "캠퍼스부터 5분 내",
    description: "멕시칸 캐주얼 그릴. 다양한 메뉴와 분위기를 즐길 수 있는 곳입니다."
  }
];
const createHeader = ({ title }) => {
  const header = document.createElement("header");
  header.innerHTML = `
      <h1 class="gnb__title text-title">${title}</h1>
      <button type="button" class="gnb__button" aria-label="음식점 추가">
        <img src="images/add-button.png" alt="음식점 추가" />
      </button>`;
  header.classList.add("gnb");
  return header;
};
const createRestaurantItem = ({
  category,
  name,
  distance,
  description,
  imgSrc
}) => {
  const li = document.createElement("li");
  li.classList.add("restaurant");
  const mappedImage = IMAGE_SRC_BY_RESTAURANTS_CATEGORY[category];
  li.innerHTML = `
      <div class="restaurant__category">
        <img src="${mappedImage}" alt="${category}" class="category-icon" />
      </div>
      <div class="restaurant__info">
        <h3 class="restaurant__name text-subtitle">${name}</h3>
        <span class="restaurant__distance text-body">${distance}</span>
        <p class="restaurant__description text-body">${description}</p>
      </div>
    `;
  return li;
};
document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");
  const header = createHeader({ title: "점심 뭐 먹지" });
  body.prepend(header);
  const restaurantList = document.querySelector(".restaurant-list");
  const addRestaurantModalButton = header.querySelector(".gnb__button");
  const addNewRestaurantModal = document.getElementById(
    "add-restaurant-dialog"
  );
  const closeModalButton = document.getElementById("cancel-dialog-btn");
  const form = addNewRestaurantModal.querySelector("form");
  restaurantsData.forEach((restaurantData) => {
    const restaurantItem = createRestaurantItem(restaurantData);
    restaurantList.appendChild(restaurantItem);
  });
  addRestaurantModalButton.addEventListener("click", () => {
    addNewRestaurantModal.showModal();
  });
  addNewRestaurantModal.addEventListener("click", (event) => {
    if (!event.target.closest(".modal-container")) {
      addNewRestaurantModal.close();
    }
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const categoryInput = document.getElementById("category");
    const distanceInput = document.getElementById("distance");
    const linkInput = document.getElementById("link");
    const restaurantsNameList = restaurantsData.map((restaurant) => {
      return restaurant.name;
    });
    const newRestaurant = {
      category: categoryInput.value,
      name: nameInput.value,
      distance: `${distanceInput.value}분 내`,
      description: descriptionInput.value,
      link: linkInput.value
    };
    const errorMessage = validateRestaurant(newRestaurant, restaurantsNameList);
    if (errorMessage) {
      alert(errorMessage);
      return;
    }
    const restaurantItem = createRestaurantItem(newRestaurant);
    restaurantList.appendChild(restaurantItem);
    form.reset();
    addNewRestaurantModal.close();
  });
  closeModalButton.addEventListener("click", () => {
    form.reset();
    addNewRestaurantModal.close();
  });
});
