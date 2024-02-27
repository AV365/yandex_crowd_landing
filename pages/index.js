import "../blocks/index.css";
import {
  apiSettings,
  validatorSettings,
  selectorsSettings,
} from "../utils/data.js";
import Api from "../components/Api.js";
import UserInfo from "../components/UserInfo.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithConfirm from "../components/PopupWithConfirm.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import PopupWithForm from "../components/PopupWithForm";

//Кноки на странице
const editButton = document.querySelector(
  selectorsSettings.buttonEditProfileSelector
);
const addCardButton = document.querySelector(
  selectorsSettings.buttonAddCardSelector
);
const editAvatarButton = document.querySelector(
  selectorsSettings.buttonEditAvatarSelector
);

const nameInput = document.querySelector(
  selectorsSettings.inputProfileNameSelector
);
const jobInput = document.querySelector(
  selectorsSettings.inputProfileInfoSelector
);
const avatarInput = document.querySelector(
  selectorsSettings.inputProfileAvatarSelector
);

const api = new Api({
  url: apiSettings.url,
  headers: {
    authorization: apiSettings.token,
    "Content-Type": "application/json",
  },
});

//Отображение загрузки данных
function changeBtnLabel(newLabel) {
  const changeBtn = document
    .querySelector(selectorsSettings.popupOpenedSelector)
    .querySelector(selectorsSettings.buttonSaveSelector);
  changeBtn.textContent = newLabel;
  if (newLabel === "Сохранение...") {
    changeBtn.disabled = true;
    changeBtn.classList.add(selectorsSettings.buttonSaveDisabled.slice(1));
  } else {
    changeBtn.disabled = false;
    changeBtn.classList.remove(selectorsSettings.buttonSaveDisabled.slice(1));
  }
}

//Пользователь
const userInfo = new UserInfo({
  name: selectorsSettings.profileNameSelector,
  info: selectorsSettings.profileAboutSelector,
  avatar: selectorsSettings.profileAvatarSelector,
});

//загружаем информацию о пользователе
function initUserInfo() {
  api.getUserInfo().then((data) => {
    userInfo.initUserInfo(data);
  });
}

const insCards = new Section(
  {
    items: {},
    renderer: (item) => {
      const newCardElement = createCard(item);
      insCards.addItem(newCardElement);
    },
  },
  selectorsSettings.cardsSelector
);

function init() {
  Promise.all([api.getUserInfo(), api.getCards()])
    .then(([userData, initialCards]) => {
      userInfo.initUserInfo(userData);

      insCards.items = initialCards;
      insCards.renderItems();
    })
    .catch((err) => {
      alert(`Внимание! При загузке данных произошла ошибка: ${err.message()}`);
    });
}
//Создаем карточку
function createCard(item) {
  const newCard = new Card(
    userInfo.id,
    item,
    selectorsSettings,
    (handleCardClick) => {
      popupPlace.open(item.link, item.name);
    },
    (handleCardDelete) => {
      popupConfirm.open(item._id);
    },
    (handleCardLike) => {
      //Карточка имеет мой лайк - удаление лайка по клику
      if (newCard.hasMyLike()) {
        api.likeCard(item._id, "DELETE").then((res) => {
          newCard.setLikeCount(res.likes.length);
          newCard.likesObj = res.likes;
        });
      } //Я еще не лайкал - ставим
      else {
        api.likeCard(item._id, "PUT").then((res) => {
          newCard.setLikeCount(res.likes.length);
          newCard.likesObj = res.likes;
        });
      }
    }
  );
  return newCard.create();
}

//Popup с превью
const popupPlace = new PopupWithImage(
  selectorsSettings.popupPreviewSelector,
  selectorsSettings.previewTitleSelector,
  selectorsSettings.previewImageSelector
);

//Popup c подтверждением
const popupConfirm = new PopupWithConfirm(
  {
    selector: selectorsSettings.popupConfirmSelector,
    submitFnc: (id) => {
      changeBtnLabel("Сохранение...");
      api
        .deleteMyPlace(id)
        .then((res) => {
          if (!res.message) return new Promise.reject("Ошибка удаления");

          let deleteELement = document.getElementById(id);
          deleteELement.classList.toggle("card-item_closed");
          //Плааааавно удаляем карточку
          deleteELement.addEventListener("transitionend", () => {
            deleteELement.remove();
            deleteELement = null;
          });
        })
        .finally((err) => {
          changeBtnLabel("Да");
          popupConfirm.close();
        });
    },
  },
  selectorsSettings.formConfirmSelector
);

//Попап с профилем
const popupProfile = new PopupWithForm(
  {
    selector: selectorsSettings.popupProfileSelector,
    submitFnc: (values) => {
      changeBtnLabel("Сохранение...");
      api
        .updateUserInfo(values.name, values.info)
        .then((res) => {
          initUserInfo();
        })
        .finally((status) => {
          changeBtnLabel("Сохранить");
          popupProfile.close();
        });
    },
  },
  selectorsSettings.formProfileSelector
);

//Попап с новой карточкой
const popupNewCard = new PopupWithForm(
  {
    selector: selectorsSettings.popupNewCardSelector,
    submitFnc: (values) => {
      changeBtnLabel("Сохранение...");
      api
        .createNewPlace(values.name, values.link)
        .then((res) => {
          const newCard = createCard(res);
          insCards.prependItem(newCard);
        })
        .finally((status) => {
          changeBtnLabel("Сохранить");
          popupNewCard.close();
        });
    },
  },
  selectorsSettings.formCardSelector
);

const popupAvatar = new PopupWithForm(
  {
    selector: selectorsSettings.popupAvatarSelector,
    submitFnc: (value) => {
      changeBtnLabel("Сохранение...");
      api
        .changeAvatar(value.link)
        .then((res) => {
          initUserInfo();
        })
        .finally((status) => {
          changeBtnLabel("Сохранить");
          popupAvatar.close();
        });
    },
  },
  selectorsSettings.formAvatarSelector
);

function setEventListeners() {
  addCardButton.addEventListener("click", (evt) => {
    popupNewCard.open();
  });

  editButton.addEventListener("click", (evt) => {
    const getUserInfo = userInfo.getUserInfo();
    nameInput.value = getUserInfo.name;
    nameInput.focus();
    jobInput.value = getUserInfo.info;
    popupProfile.open();
  });

  editAvatarButton.addEventListener("click", (evt) => {
    const getUserInfo = userInfo.getUserInfo();
    avatarInput.value = getUserInfo.avatar;
    popupAvatar.open();
  });
}

//initUserInfo();
init();
setEventListeners();

const validateProfile = new FormValidator(
  validatorSettings,
  selectorsSettings.formProfileSelector
);
validateProfile.enableValidation();

const validateAvatar = new FormValidator(
  validatorSettings,
  selectorsSettings.formAvatarSelector
);
    validateAvatar.enableValidation();

    const validateCard = new FormValidator(validatorSettings, selectorsSettings.formCardSelector);
    validateCard.enableValidation();


