import axios from 'axios';
import authHeader from './auth.header';

const login = (username, password) => {
  const data = {
    username: username,
    password: password,
  };
  return axios
    .post('/api/auth/admin/login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log(response);
      if (response.data.token) {
        // setTimeout(() => {
        //   console.log('Token Telah berakhir');
        //   logout();
        // }, response.data.expired_token);
        sessionStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

const register = (username, password) => {
  const data = {
    username: username,
    password: password,
  };
  return axios
    .post('/api/auth/admin/register', data, {
      headers: authHeader(),
    })
    .then((response) => {
      return response.data.admin;
    });
};

const logout = () => {
  axios
    .post('/api/auth/admin/logout', {
      headers: authHeader(),
    })
    .then((response) => {
      console.log(response);
      sessionStorage.removeItem('user');
    })
    .catch((error) => {
      alert('error', error.response);
    });
};

const postArticle = (title, body, image, cateogry_id) => {
  const data = new FormData();
  data.append('title', title);
  data.append('body', body);
  data.append('image', image);
  data.append('category_id', cateogry_id);
  return axios
    .post('/api/article/create-new-article', data, {
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
  data.append('image', image);
  data.append('category_id', category_id);
  return axios
    .post(`/api/article/update-article/${slug}`, data, {
      headers: authHeader(),
    })
    .then((response) => {
      // console.log(response);
      return response.data.data;
    });
};

const deleteArticle = (slug) => {
  return axios
    .post(`/api/article/delete-article/${slug}`, {
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
  data.append('gambar_produk', gambar_produk);
  data.append('product_category_id', product_category_id);
  return axios
    .post('/api/product/create-new-product', data, {
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
  data.append('gambar_produk', gambar_produk);
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
    .post(`/api/product/update-product/${slug_produk}`, data, {
      headers: authHeader(),
    })
    .then((response) => {
      console.log(response);
      // return response.data.data;
    });
};

const deleteProduct = (slug) => {
  return axios
    .post(`/api/product/delete-product/${slug}`, {
      headers: authHeader(),
    })
    .then((response) => {
      // console.log(response);
      return response.data.success;
    });
};

const updateAdmin = (new_username, username) => {
  const data = new FormData();
  data.append('username', new_username);

  return axios
    .post(`/api/auth/admin/update/${username}`, data, {
      headers: authHeader(),
    })
    .then((response) => {
      console.log(response);
      return response.data.data;
    });
};

const deleteAdmin = (username) => {
  return axios
    .post(`/api/auth/admin/delete/${username}`, {
      headers: authHeader(),
    })
    .then((response) => {
      console.log(response);
      return response.data.success;
    });
};

const getCurrentUser = () => {
  return JSON.parse(sessionStorage.getItem('user'));
};

const addCategoryProduct = (nama_category) => {
  const data = new FormData();
  data.append('name', nama_category);
  return axios
    .post(`${process.env.REACT_APP_API_URL}/api/product-category`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log(response);
      return response.data.data;
    });
};

const deleteCategoryProduct = (id) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/api/product-category/${id}`).then((response) => {
    console.log(response);
    return response.data.status;
  });
};

const addCategoryArticle = (nama_category) => {
  const data = new FormData();
  data.append('name', nama_category);
  return axios
    .post(`${process.env.REACT_APP_API_URL}/api/article-category`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log(response);
      return response.data.data;
    });
};
const deleteCategoryArticle = (id) => {
  return axios.delete(`${process.env.REACT_APP_API_URL}/api/article-category/${id}`).then((response) => {
    console.log(response);
    return response.data.status;
  });
};
const authService = {
  login,
  register,
  logout,
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
};
export default authService;
