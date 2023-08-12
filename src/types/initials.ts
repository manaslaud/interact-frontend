import {
  Education,
  Achievement,
  Project,
  Opening,
  Membership,
  Post,
  Application,
  ProjectInvitation,
  ProjectChatMembership,
  User,
  ProjectMessage,
  Chat,
  Message,
  ProjectChat,
  Comment,
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

export const initialUser: User = {
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

export const initialProject: Project = {
  id: '',
  userID: '',
  title: '',
  tagline: '',
  coverPic: '',
  description: '',
  page: '',
  user: initialUser,
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
  project: initialProject,
  userID: '',
  user: initialUser,
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
  project: initialProject,
  userID: '',
  user: initialUser,
  role: '',
  title: '',
  active: false,
  createdAt: new Date(),
};

export const initialPost: Post = {
  id: '',
  userID: '',
  images: [],
  content: '',
  user: initialUser,
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

export const initialComment: Comment = {
  id: '',
  userID: '',
  user: initialUser,
  content: '',
  noLikes: 0,
  noReplies: 0,
  createdAt: new Date(),
  likedBy: [],
  replies: [],
  isRepliedComment: false,
};

export const initialApplication: Application = {
  id: '',
  openingID: '',
  opening: initialOpening,
  userID: '',
  user: initialUser,
  project: initialProject,
  status: 0,
  content: '',
  resume: '',
  links: [],
  createdAt: new Date(),
};

export const initialMessage: Message = {
  id: '',
  content: '',
  chatID: '',
  userID: '',
  user: initialUser,
  createdAt: new Date(),
  read: false,
  postID: '',
  post: initialPost,
  projectID: '',
  project: initialProject,
};

export const initialProjectMessage: ProjectMessage = {
  id: '',
  content: '',
  projectChatID: '',
  userID: '',
  user: initialUser,
  createdAt: new Date(),
  read: false,
  readBy: [],
};

export const initialChat: Chat = {
  id: '',
  title: '',
  description: '',
  createdByID: '',
  createdBy: initialUser,
  acceptedByID: '',
  acceptedBy: initialUser,
  createdAt: new Date(),
  messages: [],
  latestMessage: initialMessage,
  accepted: false,
};

export const initialProjectChat: ProjectChat = {
  id: '',
  title: '',
  description: '',
  createdByID: '',
  createdBy: initialUser,
  projectID: '',
  project: initialProject,
  memberships: [],
  createdAt: new Date(),
  messages: [],
  latestMessage: initialProjectMessage,
  accepted: false,
};

export const initialProjectInvitation: ProjectInvitation = {
  id: '',
  projectID: '',
  project: initialProject,
  userID: '',
  user: initialUser,
  title: '',
  status: 0,
  isRead: false,
  createdAt: new Date(),
};

export const initialProjectChatMembership: ProjectChatMembership = {
  id: '',
  userID: '',
  user: initialUser,
  projectID: '',
  project: initialProject,
  projectChatID: '',
  projectChat: initialProjectChat,
  createdAt: new Date(),
};
