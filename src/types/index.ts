export interface TypingStatus {
  user: userType;
  chatID: string;
}

export interface Education {
  university: string;
  degree: string;
  description: string;
}

export interface PostBookmark {
  id: string;
  userID: string;
  title: string;
  createdAt: Date;
  postItems: PostBookmarkItem[];
}

export interface PostBookmarkItem {
  id: string;
  postBookmarkID: string;
  postID: string;
  post: postType;
}

export interface ProjectBookmark {
  id: string;
  userID: string;
  title: string;
  createdAt: Date;
  projectItems: ProjectBookmarkItem[];
}

export interface ProjectBookmarkItem {
  id: string;
  projectBookmarkID: string;
  projectID: string;
  project: projectType;
}

export interface Achievement {
  id: string;
  title: string;
  skills: string[];
}

export interface Membership {
  id: string;
  projectID: string;
  project: projectType;
  userID: string;
  user: userType;
  role: string;
  title: string;
  active: boolean;
  createdAt: Date;
}

export interface Opening {
  id: string;
  projectID: string;
  project: projectType;
  userID: string;
  user: userType;
  title: string;
  description: string;
  applications: [];
  noOfApplications: number;
  tags: string[];
  active: boolean;
  createdAt: Date;
}

export interface userType {
  id: string;
  tags: string[];
  email: string;
  name: string;
  active: boolean;
  profilePic: string;
  coverPic: string;
  username: string;
  phoneNo: string;
  bio: string;
  title: string;
  tagline: string;
  education: Education[];
  achievements: Achievement[];
  followers: userType[];
  following: userType[];
  memberships: Membership[];
  posts: postType[];
  projects: projectType[];
  noFollowers: number;
  noFollowing: number;
  isFollowing?: boolean;
  passwordChangedAt: Date;
  lastViewed: projectType[];
}

export interface projectType {
  id: string;
  userID: string;
  title: string;
  tagline: string;
  coverPic: '';
  description: string;
  page: string;
  user: userType;
  likedBy: userType[];
  comments: commentType[];
  noLikes: number;
  noShares: number;
  noComments: number;
  createdAt: Date;
  tags: string[];
  category: string;
  memberships: Membership[];
  openings: Opening[];
  hashes: string[];
  isPrivate: boolean;
  views: number;
  privateLinks: string[];
  links: string[];
}

export interface postType {
  id: string;
  userID: string;
  images: string[];
  content: string;
  user: userType;
  likedBy: string[];
  noLikes: number;
  noShares: number;
  noComments: number;
  comments: string[];
  postedAt: Date;
  tags: string[];
  hashes: string[];
  edited: boolean;
}

export interface commentType {
  id: string;
  userID: string;
  user: userType;
  content: string;
  noLikes: number;
  noReplies: number;
  createdAt: Date;
  likedBy: string[];
  replies: commentType[];
  isRepliedComment: boolean;
}

export interface applicationType {
  id: string;
  openingID: string;
  opening: Opening;
  project: projectType;
  userID: string;
  user: userType;
  status: number;
  content: string;
  resume: string;
  links: string[];
  createdAt: Date;
}

export interface NotificationType {
  id: string;
  notificationType: number;
  projectID: string;
  project: projectType;
  postID: string;
  post: postType;
  userID: string;
  user: userType;
  senderID: string;
  sender: userType;
  openingID: string;
  opening: Opening;
  applicationID: string;
  application: applicationType;
  isRead: boolean;
  createdAt: Date;
}

export interface MessageType {
  id: string;
  content: string;
  chatID: string;
  // chat: ChatType;
  userID: string;
  user: userType;
  createdAt: Date;
  read: boolean;
  postID: string;
  post: postType;
  projectID: string;
  project: projectType;
}

export interface GroupMessageType {
  id: string;
  content: string;
  chatID: string;
  chat: GroupChatType;
  userID: string;
  user: userType;
  createdAt: Date;
  read: boolean;
  readBy: userType[];
}

export interface ProjectMessageType {
  id: string;
  content: string;
  projectChatID: string;
  // projectChat: ProjectChatType;
  userID: string;
  user: userType;
  createdAt: Date;
  read: boolean;
  readBy: userType[];
}

export interface ChatType {
  id: string;
  title: string;
  description: string;
  createdByID: string;
  createdBy: userType;
  acceptedByID: string;
  acceptedBy: userType;
  createdAt: Date;
  messages: MessageType[];
  latestMessage: MessageType;
  accepted: boolean;
}

export interface GroupChatType {
  id: string;
  title: string;
  description: string;
  createdByID: string;
  createdBy: userType;
  members: userType[];
  createdAt: Date;
  messages: GroupChatType[];
  latestMessage: GroupChatType;
  accepted: boolean;
  // invitations:chatInvitations
}

export interface ProjectChatType {
  id: string;
  title: string;
  description: string;
  createdByID: string;
  createdBy: userType;
  projectID: string;
  project: projectType;
  memberships: ProjectChatMembership[];
  createdAt: Date;
  messages: ProjectMessageType[];
  latestMessage: ProjectMessageType;
  accepted: boolean;
}

export interface ProjectChatMembership {
  id: string;
  userID: string;
  user: userType;
  projectID: string;
  project: projectType;
  projectChatID: string;
  projectChat: ProjectChatType;
  createdAt: Date;
}

export interface ProjectInvitation {
  id: string;
  projectID: string;
  project: projectType;
  userID: string;
  user: userType;
  title: string;
  status: number;
  isRead: boolean;
  createdAt: Date;
}

export interface BookmarkItemType {
  typeOfItem: string;
  item: projectType | postType;
}
export interface BookmarkType {
  title: string;
  items: BookmarkItemType[];
}
