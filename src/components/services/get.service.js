import axios from 'axios';
import authHeader from './auth.header';

const getAllAdmin = () => {
  return axios.get(`/api/auth/admin/read-all-admin`, { headers: authHeader() }).then((response) => {
    return response.data.admin;
  });
};

const getAllArticle = () => {
  return axios.get(`/api/read-all-article`).then((response) => {
    // console.log(response);
    return response.data.data;
  });
};

const getAllProduct = () => {
  return axios.get(`/api/read-all-product`).then((response) => {
    // console.log(response.data.data)
    return response.data.data;
  });
};

const getAllTransaksi = () => {
  //${process.env.REACT_APP_API_URL_TRANSAKSI}
  return axios.get(`${process.env.REACT_APP_API_URL_TRANSAKSI}/api/transaksi`).then((response) => {
    return response.data.data;
  });
};

const getAllCategoryProduct = () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/api/product-category`).then((response) => {
    // console.log(response);
    return response.data.data;
  });
};
const getAllCategoryArticle = () => {
  return axios.get(`${process.env.REACT_APP_API_URL}/api/article-category`).then((response) => {
    // console.log(response);
    return response.data.data;
  });
};
const getService = {
  getAllAdmin,
  getAllArticle,
  getAllProduct,
  getAllTransaksi,
  getAllCategoryProduct,
  getAllCategoryArticle,
};

export default getService;
