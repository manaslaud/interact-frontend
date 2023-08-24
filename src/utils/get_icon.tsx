import React, { ReactElement } from 'react';
import {
  AmazonLogo,
  AndroidLogo,
  AngularLogo,
  AppleLogo,
  AppStoreLogo,
  Atom,
  BehanceLogo,
  CodepenLogo,
  CodesandboxLogo,
  DiscordLogo,
  DribbbleLogo,
  DropboxLogo,
  FacebookLogo,
  FigmaLogo,
  FramerLogo,
  GitBranch,
  GithubLogo,
  GitlabLogo,
  GoogleChromeLogo,
  GoogleDriveLogo,
  GoogleLogo,
  GooglePhotosLogo,
  GooglePlayLogo,
  Link,
  LinkedinLogo,
  LinuxLogo,
  MediumLogo,
  MessengerLogo,
  MetaLogo,
  MicrosoftExcelLogo,
  MicrosoftOutlookLogo,
  MicrosoftPowerpointLogo,
  MicrosoftTeamsLogo,
  MicrosoftWordLogo,
  NotionLogo,
  PatreonLogo,
  PaypalLogo,
  PhosphorLogo,
  PinterestLogo,
  RedditLogo,
  SlackLogo,
  SnapchatLogo,
  SoundcloudLogo,
  SpotifyLogo,
  StackOverflowLogo,
  StripeLogo,
  TelegramLogo,
  TiktokLogo,
  TwitchLogo,
  TwitterLogo,
  WebhooksLogo,
  WhatsappLogo,
  WindowsLogo,
  YoutubeLogo,
} from '@phosphor-icons/react';

const getIcon = (str: string): ReactElement => {
  switch (str.toLowerCase()) {
    case 'amazon':
      return <AmazonLogo size={32} weight="duotone" />;
    case 'android':
      return <AndroidLogo size={32} weight="duotone" />;
    case 'angular':
      return <AngularLogo size={32} weight="duotone" />;
    case 'apple':
      return <AppleLogo size={32} weight="duotone" />;
    case 'appstore':
      return <AppStoreLogo size={32} weight="duotone" />;
    case 'behance':
      return <BehanceLogo size={32} weight="duotone" />;
    case 'codepen':
      return <CodepenLogo size={32} weight="duotone" />;
    case 'codesandbox':
      return <CodesandboxLogo size={32} weight="duotone" />;
    case 'discord':
      return <DiscordLogo size={32} weight="duotone" />;
    case 'dribbble':
      return <DribbbleLogo size={32} weight="duotone" />;
    case 'dropbox':
      return <DropboxLogo size={32} weight="duotone" />;
    case 'facebook':
      return <FacebookLogo size={32} weight="duotone" />;
    case 'figma':
      return <FigmaLogo size={32} weight="duotone" />;
    case 'framer':
      return <FramerLogo size={32} weight="duotone" />;
    case 'git':
      return <GitBranch size={32} weight="duotone" />;
    case 'github':
      return <GithubLogo size={32} weight="duotone" />;
    case 'gitlab':
      return <GitlabLogo size={32} weight="duotone" />;
    case 'google':
      return <GoogleLogo size={32} weight="duotone" />;
    case 'chrome':
      return <GoogleChromeLogo size={32} weight="duotone" />;
    case 'drive':
      return <GoogleDriveLogo size={32} weight="duotone" />;
    case 'photos':
      return <GooglePhotosLogo size={32} weight="duotone" />;
    case 'play':
      return <GooglePlayLogo size={32} weight="duotone" />;
    case 'linkedin':
      return <LinkedinLogo size={32} weight="duotone" />;
    case 'linux':
      return <LinuxLogo size={32} weight="duotone" />;
    case 'medium':
      return <MediumLogo size={32} weight="duotone" />;
    case 'messenger':
      return <MessengerLogo size={32} weight="duotone" />;
    case 'meta':
      return <MetaLogo size={32} weight="duotone" />;
    case 'microsoftexcel':
      return <MicrosoftExcelLogo size={32} weight="duotone" />;
    case 'microsoftoutlook':
      return <MicrosoftOutlookLogo size={32} weight="duotone" />;
    case 'microsoftpowerpoint':
      return <MicrosoftPowerpointLogo size={32} weight="duotone" />;
    case 'microsoftteams':
      return <MicrosoftTeamsLogo size={32} weight="duotone" />;
    case 'microsoftword':
      return <MicrosoftWordLogo size={32} weight="duotone" />;
    case 'notion':
      return <NotionLogo size={32} weight="duotone" />;
    case 'patreon':
      return <PatreonLogo size={32} weight="duotone" />;
    case 'paypal':
      return <PaypalLogo size={32} weight="duotone" />;
    case 'phosphor':
      return <PhosphorLogo size={32} weight="duotone" />;
    case 'pinterest':
      return <PinterestLogo size={32} weight="duotone" />;
    case 'react':
      return <Atom size={32} weight="duotone" />;
    case 'reddit':
      return <RedditLogo size={32} weight="duotone" />;
    case 'slack':
      return <SlackLogo size={32} weight="duotone" />;
    case 'snapchat':
      return <SnapchatLogo size={32} weight="duotone" />;
    case 'soundcloud':
      return <SoundcloudLogo size={32} weight="duotone" />;
    case 'spotify':
      return <SpotifyLogo size={32} weight="duotone" />;
    case 'stackoverflow':
      return <StackOverflowLogo size={32} weight="duotone" />;
    case 'stripe':
      return <StripeLogo size={32} weight="duotone" />;
    case 'telegram':
      return <TelegramLogo size={32} weight="duotone" />;
    case 'tiktok':
      return <TiktokLogo size={32} weight="duotone" />;
    case 'twitch':
      return <TwitchLogo size={32} weight="duotone" />;
    case 'twitter':
      return <TwitterLogo size={32} weight="duotone" />;
    case 'webhooks':
      return <WebhooksLogo size={32} weight="duotone" />;
    case 'whatsapp':
      return <WhatsappLogo size={32} weight="duotone" />;
    case 'windows':
      return <WindowsLogo size={32} weight="duotone" />;
    case 'youtube':
      return <YoutubeLogo size={32} weight="duotone" />;
    default:
      return <Link size={32} weight="duotone" />;
  }
};

export default getIcon;
