import {
  Achievement,
  ChatType,
  Education,
  Membership,
  MessageType,
  Opening,
  ProjectChatMembership,
  ProjectChatType,
  ProjectInvitation,
  ProjectMessageType,
  applicationType,
  commentType,
  postType,
  projectType,
  userType,
} from '.';

export const initialEducation: Education = {
  university: '',
  degree: '',
  description: '',
};

export const initialAchievement: Achievement = {
  id: '',
  title: '',
  skills: [],
};

export const initialUserType: userType = {
  id: '',
  tags: [],
  email: '',
  name: '',
  profilePic: '',
  coverPic: '',
  username: '',
  phoneNo: '',
  bio: '',
  title: '',
  tagline: '',
  education: [],
  achievements: [],
  followers: [],
  following: [],
  memberships: [],
  posts: [],
  projects: [],
  noFollowers: 0,
  noFollowing: 0,
  active: true,
  isFollowing: false,
  passwordChangedAt: new Date(),
  lastViewed: [],
};

export const initialProjectType: projectType = {
  id: '',
  userID: '',
  title: '',
  tagline: '',
  coverPic: '',
  description: '',
  page: '',
  user: initialUserType,
  likedBy: [],
  comments: [],
  noLikes: 0,
  noShares: 0,
  noComments: 0,
  createdAt: new Date(),
  tags: [],
  category: '',
  memberships: [],
  openings: [],
  hashes: [],
  isPrivate: false,
  views: 0,
  privateLinks: [],
  links: [],
};

export const initialOpening: Opening = {
  id: '',
  projectID: '',
  project: initialProjectType,
  userID: '',
  user: initialUserType,
  title: '',
  description: '',
  applications: [],
  noOfApplications: 0,
  tags: [],
  active: false,
  createdAt: new Date(),
};

export const initialMembership: Membership = {
  id: '',
  projectID: '',
  project: initialProjectType,
  userID: '',
  user: initialUserType,
  role: '',
  title: '',
  active: false,
  createdAt: new Date(),
};

export const initialPostType: postType = {
  id: '',
  userID: '',
  images: [],
  content: '',
  user: initialUserType,
  likedBy: [],
  noLikes: 0,
  noShares: 0,
  noComments: 0,
  comments: [],
  postedAt: new Date(),
  tags: [],
  hashes: [],
  edited: false,
};

export const initialCommentType: commentType = {
  id: '',
  userID: '',
  user: initialUserType,
  content: '',
  noLikes: 0,
  noReplies: 0,
  createdAt: new Date(),
  likedBy: [],
  replies: [],
  isRepliedComment: false,
};

export const initialApplicationType: applicationType = {
  id: '',
  openingID: '',
  opening: initialOpening,
  userID: '',
  user: initialUserType,
  project: initialProjectType,
  status: 0,
  content: '',
  resume: '',
  links: [],
  createdAt: new Date(),
};

export const initialMessage: MessageType = {
  id: '',
  content: '',
  chatID: '',
  userID: '',
  user: initialUserType,
  createdAt: new Date(),
  read: false,
  postID: '',
  post: initialPostType,
  projectID: '',
  project: initialProjectType,
};

export const initialProjectMessage: ProjectMessageType = {
  id: '',
  content: '',
  projectChatID: '',
  userID: '',
  user: initialUserType,
  createdAt: new Date(),
  read: false,
  readBy: [],
};

export const initialChat: ChatType = {
  id: '',
  title: '',
  description: '',
  createdByID: '',
  createdBy: initialUserType,
  acceptedByID: '',
  acceptedBy: initialUserType,
  createdAt: new Date(),
  messages: [],
  latestMessage: initialMessage,
  accepted: false,
};

export const initialProjectChat: ProjectChatType = {
  id: '',
  title: '',
  description: '',
  createdByID: '',
  createdBy: initialUserType,
  projectID: '',
  project: initialProjectType,
  memberships: [],
  createdAt: new Date(),
  messages: [],
  latestMessage: initialProjectMessage,
  accepted: false,
};

export const initialProjectInvitation: ProjectInvitation = {
  id: '',
  projectID: '',
  project: initialProjectType,
  userID: '',
  user: initialUserType,
  title: '',
  status: 0,
  isRead: false,
  createdAt: new Date(),
};

export const initialProjectChatMembership: ProjectChatMembership = {
  id: '',
  userID: '',
  user: initialUserType,
  projectID: '',
  project: initialProjectType,
  projectChatID: '',
  projectChat: initialProjectChat,
  createdAt: new Date(),
};
