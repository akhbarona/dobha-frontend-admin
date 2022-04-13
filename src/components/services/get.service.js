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
    return response.data.data;
  });
};
const getService = {
  getAllAdmin,
  getAllArticle,
  getAllProduct,
};

export default getService;
