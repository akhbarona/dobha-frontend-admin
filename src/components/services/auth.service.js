import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import authHeader from './auth.header';

const API_URL = process.env.REACT_APP_API_URL;

const login = (username, password) => {
  const data = {
    username: username,
    password: password,
  };
  return axios
    .post(`${API_URL}/api/auth/admin/login`, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      // console.log(response);
      sessionStorage.setItem('user', JSON.stringify(response.data));

      return response.data;
    });
};

const register = (username, password) => {
  const data = {
    username: username,
    password: password,
  };
  return axios
    .post(`${API_URL}/api/auth/admin/register`, data, {
      headers: authHeader(),
    })
    .then((response) => {
      return response.data.admin;
    });
};

const Logout = () => {
  axios
    .post(`${API_URL}/api/auth/admin/logout`, {
      headers: authHeader(),
    })
    .then((response) => {
      console.log(response);

      sessionStorage.removeItem('user');
      Swal.fire({ title: 'Sesi telah berakhir, Anda Telah Logout!', icon: 'success' });
    })
    .catch((error) => {
      alert('error', error.response);
      sessionStorage.removeItem('user');
    });
};

const postArticle = (title, body, image, cateogry_id) => {
  const data = new FormData();
  data.append('title', title);
  data.append('body', body);
  if (image !== null) {
    data.append('image', image);
  }
  data.append('category_id', cateogry_id);
  return axios
    .post(`${API_URL}/api/article/create-new-article`, data, {
      headers: authHeader(),
    })
    .then((response) => {
      // console.log(response);
      return response.data.data;
    });
};

const updateArticle = (title, body, image, slug, category_id) => {
  const data = new FormData();
  data.append('title', title);
  data.append('body', body);

  if (image !== null) {
    data.append('image', image);
  }
  data.append('category_id', category_id);
  return axios
    .post(`${API_URL}/api/article/update-article/${slug}`, data, {
      headers: authHeader(),
    })
    .then((response) => {
      // console.log(response);
      return response.data.data;
    });
};

const deleteArticle = (slug) => {
  return axios
    .post(`${API_URL}/api/article/delete-article/${slug}`, {
      headers: authHeader(),
    })
    .then((response) => {
      // console.log(response);
      return response.data.success;
    });
};

const postProduct = (kode_produk, nama_produk, deskripsi_produk, stock_produk, harga_satuan, gambar_produk, product_category_id) => {
  const data = new FormData();
  data.append('kode_produk', kode_produk);
  data.append('nama_produk', nama_produk);
  data.append('deskripsi_produk', deskripsi_produk);
  data.append('stock_produk', stock_produk);
  data.append('harga_satuan', harga_satuan);
  if (gambar_produk !== null) {
    data.append('gambar_produk', gambar_produk);
  }
  data.append('product_category_id', product_category_id);
  return axios
    .post(`${API_URL}/api/product/create-new-product`, data, {
      headers: authHeader(),
    })
    .then((response) => {
      console.log(response);
      return response.data.data;
    });
};

const updateProduct = (kode_produk, nama_produk, deskripsi_produk, stock_produk, harga_satuan, gambar_produk, slug_produk, product_category_id) => {
  const data = new FormData();
  console.log(slug_produk);
  data.append('kode_produk', kode_produk);
  data.append('nama_produk', nama_produk);
  data.append('deskripsi_produk', deskripsi_produk);
  data.append('stock_produk', stock_produk);
  data.append('harga_satuan', harga_satuan);
  if (gambar_produk !== null) {
    data.append('gambar_produk', gambar_produk);
  }
  data.append('product_category_id', product_category_id);
  // const data = {
  //   kode_produk: kode_produk,
  //   nama_produk: nama_produk,
  //   deskripsi_produk: deskripsi_produk,
  //   stock_produk: stock_produk,
  //   harga_satuan: harga_satuan,
  //   gambar_produk: gambar_produk,
  // };
  return axios
    .post(`${API_URL}/api/product/update-product/${slug_produk}`, data, {
      headers: authHeader(),
    })
    .then((response) => {
      console.log(response);
      // return response.data.data;
    });
};

const deleteProduct = (slug) => {
  return axios
    .post(`${API_URL}/api/product/delete-product/${slug}`, {
      headers: authHeader(),
    })
    .then((response) => {
      // console.log(response);
      return response.data.success;
    });
};

const updateAdmin = (new_username, new_password, username) => {
  const data = new FormData();
  data.append('username', new_username);
  data.append('password', new_password);

  return axios
    .post(`${API_URL}/api/auth/admin/update/${username}`, data, {
      headers: authHeader(),
    })
    .then((response) => {
      console.log(response);
      return response.data.data;
    });
};

const deleteAdmin = (username) => {
  return axios
    .post(`${API_URL}/api/auth/admin/delete/${username}`, {
      headers: authHeader(),
    })
    .then((response) => {
      console.log(response);
      return response.data.message;
    });
};

const getCurrentUser = () => {
  return JSON.parse(sessionStorage.getItem('user'));
};

const addCategoryProduct = (nama_category) => {
  const data = new FormData();
  data.append('name', nama_category);
  return axios
    .post(`${API_URL}/api/create-product-category`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log(response);
      return response.data.data;
    });
};
const updateCategoryProduct = (newName, id) => {
  const data = new FormData();
  data.append('name', newName);
  return axios
    .post(`${API_URL}/api/update-product-category/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.data.data;
    });
};
const deleteCategoryProduct = (id) => {
  return axios.post(`${API_URL}/api/delete-product-category/${id}`).then((response) => {
    console.log(response);
    return response.data.status;
  });
};

const addCategoryArticle = (nama_category) => {
  const data = new FormData();
  data.append('name', nama_category);
  return axios
    .post(`${API_URL}/api/create-article-category`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log(response);
      return response.data.data;
    });
};

const updateCategoryArticle = (newName, id) => {
  const data = new FormData();
  data.append('name', newName);
  return axios
    .post(`${API_URL}/api/update-article-category/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      return response.data.data;
    });
};
const deleteCategoryArticle = (id) => {
  return axios.post(`${API_URL}/api/delete-article-category/${id}`).then((response) => {
    console.log(response);
    return response.data.status;
  });
};
const authService = {
  login,
  register,
  Logout,
  getCurrentUser,
  postArticle,
  updateArticle,
  deleteArticle,
  postProduct,
  updateProduct,
  deleteProduct,
  deleteAdmin,
  updateAdmin,
  addCategoryProduct,
  deleteCategoryProduct,
  addCategoryArticle,
  deleteCategoryArticle,
  updateCategoryProduct,
  updateCategoryArticle,
};
export default authService;
