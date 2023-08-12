export interface TypingStatus {
  user: User;
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
  post: Post;
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
  project: Project;
}

export interface Achievement {
  id: string;
  title: string;
  skills: string[];
}

export interface Membership {
  id: string;
  projectID: string;
  project: Project;
  userID: string;
  user: User;
  role: string;
  title: string;
  active: boolean;
  createdAt: Date;
}

export interface Opening {
  id: string;
  projectID: string;
  project: Project;
  userID: string;
  user: User;
  title: string;
  description: string;
  applications: [];
  noOfApplications: number;
  tags: string[];
  active: boolean;
  createdAt: Date;
}

export interface User {
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
  followers: User[];
  following: User[];
  memberships: Membership[];
  posts: Post[];
  projects: Project[];
  noFollowers: number;
  noFollowing: number;
  isFollowing?: boolean;
  passwordChangedAt: Date;
  lastViewed: Project[];
}

export interface Project {
  id: string;
  userID: string;
  title: string;
  tagline: string;
  coverPic: '';
  description: string;
  page: string;
  user: User;
  likedBy: User[];
  comments: Comment[];
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

export interface Post {
  id: string;
  userID: string;
  images: string[];
  content: string;
  user: User;
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

export interface Comment {
  id: string;
  userID: string;
  user: User;
  content: string;
  noLikes: number;
  noReplies: number;
  createdAt: Date;
  likedBy: string[];
  replies: Comment[];
  isRepliedComment: boolean;
}

export interface Application {
  id: string;
  openingID: string;
  opening: Opening;
  project: Project;
  userID: string;
  user: User;
  status: number;
  content: string;
  resume: string;
  links: string[];
  createdAt: Date;
}

export interface Notification {
  id: string;
  notificationType: number;
  projectID: string;
  project: Project;
  postID: string;
  post: Post;
  userID: string;
  user: User;
  senderID: string;
  sender: User;
  openingID: string;
  opening: Opening;
  applicationID: string;
  application: Application;
  isRead: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  content: string;
  chatID: string;
  userID: string;
  user: User;
  createdAt: Date;
  read: boolean;
  postID: string;
  post: Post;
  projectID: string;
  project: Project;
}

export interface GroupMessage {
  id: string;
  content: string;
  chatID: string;
  chat: GroupChat;
  userID: string;
  user: User;
  createdAt: Date;
  read: boolean;
  readBy: User[];
}

export interface ProjectMessage {
  id: string;
  content: string;
  projectChatID: string;
  userID: string;
  user: User;
  createdAt: Date;
  read: boolean;
  readBy: User[];
}

export interface Chat {
  id: string;
  title: string;
  description: string;
  createdByID: string;
  createdBy: User;
  acceptedByID: string;
  acceptedBy: User;
  createdAt: Date;
  messages: Message[];
  latestMessage: Message;
  accepted: boolean;
}

export interface GroupChat {
  id: string;
  title: string;
  description: string;
  createdByID: string;
  createdBy: User;
  members: User[];
  createdAt: Date;
  messages: GroupChat[];
  latestMessage: GroupChat;
  accepted: boolean;
}

export interface ProjectChat {
  id: string;
  title: string;
  description: string;
  createdByID: string;
  createdBy: User;
  projectID: string;
  project: Project;
  memberships: ProjectChatMembership[];
  createdAt: Date;
  messages: ProjectMessage[];
  latestMessage: ProjectMessage;
  accepted: boolean;
}

export interface ProjectChatMembership {
  id: string;
  userID: string;
  user: User;
  projectID: string;
  project: Project;
  projectChatID: string;
  projectChat: ProjectChat;
  createdAt: Date;
}

export interface ProjectInvitation {
  id: string;
  projectID: string;
  project: Project;
  userID: string;
  user: User;
  title: string;
  status: number;
  isRead: boolean;
  createdAt: Date;
}

export interface BookmarkItem {
  typeOfItem: string;
  item: Project | Post;
}

export interface Bookmark {
  title: string;
  items: BookmarkItem[];
}
