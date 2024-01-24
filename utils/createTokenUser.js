const createTokenUser = (user) => {
  
  return {
    name: user.name,
    phone_number: user.phone_number,
    userId: user._id,
    role: user.role,
    profile_picture: user.profile_picture ? user.profile_picture : null,
    location: user.location ? user.location : null,
    profile_completed: user.profile_completed?user.profile_completed:false,
  };
};

module.exports = createTokenUser;
