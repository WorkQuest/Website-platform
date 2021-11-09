export default {
  getDiscussions: (state) => state.discussions,
  getUsersLikesOnComment: (state) => state.usersLikesOnComment,
  getUsersSubCommentsOnComment: (state) => state.usersSubCommentsOnComment,
  getPeopleListWhoLikeDiscussion: (state) => state.peopleListWhoLikeDiscussion,
  getRootComments: (state) => state.rootComments,
};
