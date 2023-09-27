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

export interface OpeningBookmark {
  id: string;
  userID: string;
  title: string;
  createdAt: Date;
  openingItems: OpeningBookmarkItem[];
}

export interface OpeningBookmarkItem {
  id: string;
  openingBookmarkID: string;
  openingID: string;
  opening: Opening;
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
  links: string[];
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
  isVerified: boolean;
  isOrganization: boolean;
}

export interface OrganizationMembership {
  id: string;
  organizationID: string;
  organization: Organization;
  userID: string;
  user: User;
  role: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  userID: string;
  user: User;
  title: string;
  memberships: OrganizationMembership[];
  createdAt: Date;
}

export interface Project {
  id: string;
  slug: string;
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
  tags: string[];
  category: string;
  memberships: Membership[];
  invitations: Invitation[];
  openings: Opening[];
  chats: GroupChat[];
  hashes: string[];
  isPrivate: boolean;
  views: number;
  totalNoViews: number;
  privateLinks: string[];
  links: string[];
  createdAt: Date;
}

export interface PostTag {
  id: string;
  userID: string;
  user: User;
  postID: string;
}
export interface Post {
  id: string;
  userID: string;
  rePostID: string;
  rePost: Post | null;
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
  usersTagged: PostTag[];
}

export interface Comment {
  id: string;
  userID: string;
  user: User;
  postID: string;
  post: Post;
  projectID: string;
  project: Project;
  content: string;
  noLikes: number;
  likedBy: string[];
  createdAt: Date;
}

export interface Application {
  id: string;
  openingID: string;
  opening: Opening;
  projectID: string;
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
  chat: Chat | null;
  userID: string;
  user: User;
  read: boolean;
  postID: string;
  post: Post;
  projectID: string;
  project: Project;
  openingID: string;
  opening: Opening;
  profileID: string;
  profile: User;
  messageID: string;
  message: Message | null;
  createdAt: Date;
}

export interface GroupChatMessage {
  id: string;
  content: string;
  chatID: string;
  chat: GroupChat | null;
  userID: string;
  user: User;
  read: boolean;
  postID: string;
  post: Post;
  projectID: string;
  project: Project;
  openingID: string;
  opening: Opening;
  profileID: string;
  profile: User;
  messageID: string;
  message: GroupChatMessage | null;
  createdAt: Date;
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
  latestMessageID: string;
  latestMessage: Message;
  lastReadMessageByCreatingUserID: string;
  lastReadMessageByAcceptingUserID: string;
  accepted: boolean;
}

export interface GroupChat {
  id: string;
  title: string;
  description: string;
  coverPic: string;
  userID: string;
  user: User;
  organizationID: string;
  organization: Organization;
  projectID: string;
  project: Project;
  memberships: GroupChatMembership[];
  messages: GroupChatMessage[];
  invitations: Invitation[];
  latestMessageID: string;
  latestMessage: GroupChatMessage;
  createdAt: Date;
}

export interface GroupChatMembership {
  id: string;
  userID: string;
  user: User;
  chatID: string;
  chat: GroupChat;
  role: string;
  createdAt: Date;
}

export interface Invitation {
  id: string;
  userID: string;
  user: User;
  projectID: string;
  project: Project;
  organizationID: string;
  organization: Organization;
  chatID: string;
  chat: GroupChat;
  title: string;
  status: number;
  isRead: boolean;
  createdAt: Date;
}
