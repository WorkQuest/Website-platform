export default (context) => {
  const hasAccess = !!context.app.context.app.$cookies.get('access');
  const hasRefresh = !!context.app.context.app.$cookies.get('refresh');
  const isEmailConfirmed = context.app.context.app.$cookies.get('status');

  if (hasAccess && hasRefresh && isEmailConfirmed > 0) {
    return context.redirect('/about');
  }
  return null;
};
