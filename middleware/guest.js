export default (context) => {
  const hasAccess = !!context.app.context.app.$cookies.get('access');
  const hasRefresh = !!context.app.context.app.$cookies.get('refresh');
  // const isEmailConfirmed = context.app.context.app.$cookies.get('status');
  const { role } = context.app.store.getters['user/getUserData'];

  if (hasAccess && hasRefresh && role === 'worker') {
    return context.redirect('/profile');
  }
  console.log(role);
  if (hasAccess && hasRefresh && role === 'employer') {
    return context.redirect('/questors');
  }
  if (!role) {
    return context.redirect('/role');
  }
  return null;
};
