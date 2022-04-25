import axios from 'axios';
const authHeader = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  //   console.log(user.token);
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

export default authHeader;
