const authHeader = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  //   console.log(user.token);
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

export default authHeader;
