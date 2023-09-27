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
  InstagramLogo,
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

const getIcon = (str: string, size = 32): ReactElement => {
  switch (str.toLowerCase()) {
    case 'amazon':
      return <AmazonLogo size={size} weight="duotone" />;
    case 'android':
      return <AndroidLogo size={size} weight="duotone" />;
    case 'angular':
      return <AngularLogo size={size} weight="duotone" />;
    case 'apple':
      return <AppleLogo size={size} weight="duotone" />;
    case 'appstore':
      return <AppStoreLogo size={size} weight="duotone" />;
    case 'behance':
      return <BehanceLogo size={size} weight="duotone" />;
    case 'codepen':
      return <CodepenLogo size={size} weight="duotone" />;
    case 'codesandbox':
      return <CodesandboxLogo size={size} weight="duotone" />;
    case 'discord':
      return <DiscordLogo size={size} weight="duotone" />;
    case 'dribbble':
      return <DribbbleLogo size={size} weight="duotone" />;
    case 'dropbox':
      return <DropboxLogo size={size} weight="duotone" />;
    case 'facebook':
      return <FacebookLogo size={size} weight="duotone" />;
    case 'figma':
      return <FigmaLogo size={size} weight="duotone" />;
    case 'framer':
      return <FramerLogo size={size} weight="duotone" />;
    case 'git':
      return <GitBranch size={size} weight="duotone" />;
    case 'github':
      return <GithubLogo size={size} weight="duotone" />;
    case 'gitlab':
      return <GitlabLogo size={size} weight="duotone" />;
    case 'google':
      return <GoogleLogo size={size} weight="duotone" />;
    case 'chrome':
      return <GoogleChromeLogo size={size} weight="duotone" />;
    case 'drive':
      return <GoogleDriveLogo size={size} weight="duotone" />;
    case 'photos':
      return <GooglePhotosLogo size={size} weight="duotone" />;
    case 'play':
      return <GooglePlayLogo size={size} weight="duotone" />;
    case 'instagram':
      return <InstagramLogo size={size} weight="duotone" />;
    case 'linkedin':
      return <LinkedinLogo size={size} weight="duotone" />;
    case 'linux':
      return <LinuxLogo size={size} weight="duotone" />;
    case 'medium':
      return <MediumLogo size={size} weight="duotone" />;
    case 'messenger':
      return <MessengerLogo size={size} weight="duotone" />;
    case 'meta':
      return <MetaLogo size={size} weight="duotone" />;
    case 'microsoftexcel':
      return <MicrosoftExcelLogo size={size} weight="duotone" />;
    case 'microsoftoutlook':
      return <MicrosoftOutlookLogo size={size} weight="duotone" />;
    case 'microsoftpowerpoint':
      return <MicrosoftPowerpointLogo size={size} weight="duotone" />;
    case 'microsoftteams':
      return <MicrosoftTeamsLogo size={size} weight="duotone" />;
    case 'microsoftword':
      return <MicrosoftWordLogo size={size} weight="duotone" />;
    case 'notion':
      return <NotionLogo size={size} weight="duotone" />;
    case 'patreon':
      return <PatreonLogo size={size} weight="duotone" />;
    case 'paypal':
      return <PaypalLogo size={size} weight="duotone" />;
    case 'phosphor':
      return <PhosphorLogo size={size} weight="duotone" />;
    case 'pinterest':
      return <PinterestLogo size={size} weight="duotone" />;
    case 'react':
      return <Atom size={size} weight="duotone" />;
    case 'reddit':
      return <RedditLogo size={size} weight="duotone" />;
    case 'slack':
      return <SlackLogo size={size} weight="duotone" />;
    case 'snapchat':
      return <SnapchatLogo size={size} weight="duotone" />;
    case 'soundcloud':
      return <SoundcloudLogo size={size} weight="duotone" />;
    case 'spotify':
      return <SpotifyLogo size={size} weight="duotone" />;
    case 'stackoverflow':
      return <StackOverflowLogo size={size} weight="duotone" />;
    case 'stripe':
      return <StripeLogo size={size} weight="duotone" />;
    case 'telegram':
      return <TelegramLogo size={size} weight="duotone" />;
    case 'tiktok':
      return <TiktokLogo size={size} weight="duotone" />;
    case 'twitch':
      return <TwitchLogo size={size} weight="duotone" />;
    case 'twitter':
      return <TwitterLogo size={size} weight="duotone" />;
    case 'webhooks':
      return <WebhooksLogo size={size} weight="duotone" />;
    case 'whatsapp':
      return <WhatsappLogo size={size} weight="duotone" />;
    case 'windows':
      return <WindowsLogo size={size} weight="duotone" />;
    case 'youtube':
      return <YoutubeLogo size={size} weight="duotone" />;
    default:
      return <Link size={size} weight="duotone" />;
  }
};

export default getIcon;
