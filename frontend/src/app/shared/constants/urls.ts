const BASE_URL = 'http://localhost:5500';

export const FOODS_URL = BASE_URL + '/api/foods';
export const FOODS_TAGS_URL = FOODS_URL + '/tags';
export const FOODS_BY_SEARCH_URL = FOODS_URL + '/search/';
export const FOODS_BY_TAG_URL = FOODS_URL + '/tag/';
export const FOOD_BY_ID_URL = FOODS_URL + '/';
export const FOOD_GET_FOODS_URL = FOODS_URL;
export const FOOD_CREATE_URL = FOODS_URL + '/create';
export const FOOD_DELETE_URL = FOODS_URL + '/delete/';
export const FOOD_UPDATE_URL = FOODS_URL + '/updateFood/';


export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_REGISTER_URL = BASE_URL + '/api/users/register';
export const USER_GET_USERS_URL = BASE_URL + '/api/users/getuser';
export const USER_DELETE_USERS_URL = BASE_URL + '/api/users/deleteuser/';


export const ORDERS_URL = BASE_URL + '/api/orders';
export const ORDER_CREATE_URL = ORDERS_URL + '/create';
export const ORDER_NEW_FOR_CURRENT_USER_URL = ORDERS_URL + '/newOrderForCurrentUser';
export const ORDER_PAY_URL = ORDERS_URL + '/pay';
export const ORDER_TRACK_URL = ORDERS_URL + '/track/';
export const ORDER_GET_URL = ORDERS_URL + '/get';
export const ORDER_TAGS_URL = ORDERS_URL + '/ordertags';
export const ORDERS_BY_TAG_URL = ORDERS_URL + '/ordertag/';
export const ORDER_UPDATE_URL = ORDERS_URL + '/updateStatus/';
