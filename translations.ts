
import { Language } from './types';

const ru = {
  admin: 'GisiAdmin Pro',
  searchPlaceholder: 'Поиск по товарам, заказам...',
  catalog: 'Каталог',
  login: 'Войти',
  logout: 'Выйти',
  exit: 'Выход',
  signup: 'Регистрация',
  fullName: 'Полное имя',
  password: 'Пароль',
  account: 'Личный кабинет',
  wishlist: 'Избранное',
  shippingNote: 'Доставка и налоги рассчитываются при оформлении.',
  warranty: 'Гарантия',
  noReviews: 'Отзывов пока нет.',
  writeReview: 'Оставить отзыв',
  addToCart: 'В корзину',
  buyNow: 'Купить сейчас',
  cart: 'Корзина',
  cartEmpty: 'Ваша корзина пуста',
  continueShopping: 'Продолжить покупки',
  subtotal: 'Итого',
  shipping: 'Доставка',
  returns: 'Возврат',
  specs: 'Характеристики',
  description: 'Описание',
  reviews: 'Отзывы',
  compare: 'Сравнение',
  dashboard: {
    title: 'Панель управления',
    welcome: 'С возвращением',
    totalOrders: 'Всего заказов',
    spent: 'Потрачено',
    points: 'Баллы лояльности',
    history: 'История заказов',
    settings: 'Настройки профиля',
    noOrders: 'У вас еще нет заказов.'
  },
  status: {
    new: 'Новый',
    confirmed: 'Подтвержден',
    packing: 'Сборка',
    shipping: 'В пути',
    delivered: 'Доставлен',
    cancelled: 'Отменен'
  },
  checkout: {
    title: 'Оформление',
    address: 'Адрес доставки',
    payment: 'Способ оплаты',
    summary: 'Ваш заказ',
    placeOrder: 'Оформить заказ',
    success: 'Заказ успешно создан!'
  }
};

const en = {
  admin: 'GisiAdmin Pro',
  searchPlaceholder: 'Search products, orders...',
  catalog: 'Catalog',
  login: 'Login',
  logout: 'Logout',
  exit: 'Exit',
  signup: 'Sign Up',
  fullName: 'Full Name',
  password: 'Password',
  account: 'Account',
  wishlist: 'Wishlist',
  shippingNote: 'Shipping and taxes calculated at checkout.',
  warranty: 'Warranty',
  noReviews: 'No reviews yet.',
  writeReview: 'Write a review',
  addToCart: 'Add to Cart',
  buyNow: 'Buy Now',
  cart: 'Cart',
  cartEmpty: 'Your cart is empty',
  continueShopping: 'Continue Shopping',
  subtotal: 'Subtotal',
  shipping: 'Shipping',
  returns: 'Returns',
  specs: 'Specs',
  description: 'Description',
  reviews: 'Reviews',
  compare: 'Comparison',
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back',
    totalOrders: 'Total Orders',
    spent: 'Total Spent',
    points: 'Loyalty Points',
    history: 'Order History',
    settings: 'Profile Settings',
    noOrders: 'You have no orders yet.'
  },
  status: {
    new: 'New',
    confirmed: 'Confirmed',
    packing: 'Packing',
    shipping: 'Shipping',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  },
  checkout: {
    title: 'Checkout',
    address: 'Shipping Address',
    payment: 'Payment Method',
    summary: 'Order Summary',
    placeOrder: 'Place Order',
    success: 'Order placed successfully!'
  }
};

const hy = {
  admin: 'GisiAdmin Pro',
  searchPlaceholder: 'Փնտրել ապրանքներ...',
  catalog: 'Կատալոգ',
  login: 'Մուտք',
  logout: 'Ելք',
  exit: 'Ելք',
  signup: 'Գրանցվել',
  fullName: 'Ամբողջական անուն',
  password: 'Գաղտնաբառ',
  account: 'Անձնական էջ',
  wishlist: 'Նախընտրածներ',
  shippingNote: 'Առաքումը և հարկերը հաշվարկվում են ձևակերպման ժամանակ:',
  warranty: 'Երաշխիք',
  noReviews: 'Կարծիքներ դեռ չկան:',
  writeReview: 'Թողնել կարծիք',
  addToCart: 'Ավելացնել զամբյուղ',
  buyNow: 'Գնել հիմա',
  cart: 'Զամբյուղ',
  cartEmpty: 'Ձեր զամբյուղը դատարկ է',
  continueShopping: 'Շարունակել գնումները',
  subtotal: 'Ընդամենը',
  shipping: 'Առաքում',
  returns: 'Վերադարձ',
  specs: 'Բնութագիր',
  description: 'Նկարագրություն',
  reviews: 'Կարծիքներ',
  compare: 'Համեմատություն',
  dashboard: {
    title: 'Կառավարման վահանակ',
    welcome: 'Բարի վերադարձ',
    totalOrders: 'Պատվերների քանակ',
    spent: 'Ծախսված',
    points: 'Միավորներ',
    history: 'Պատվերների պատմություն',
    settings: 'Կարգավորումներ',
    noOrders: 'Դուք դեռ պատվերներ չունեք:'
  },
  status: {
    new: 'Նոր',
    confirmed: 'Հաստատված',
    packing: 'Հավաքվում է',
    shipping: 'Ճանապարհին',
    delivered: 'Առաքված',
    cancelled: 'Չեղարկված'
  },
  checkout: {
    title: 'Ձևակերպում',
    address: 'Առաքման հասցե',
    payment: 'Վճարման եղանակ',
    summary: 'Պատվերի ամփոփում',
    placeOrder: 'Պատվիրել',
    success: 'Պատվերը հաջողությամբ ստեղծվեց!'
  }
};

export const translations: Record<Language, any> = { en, hy, ru };
