import React, { ReactElement } from 'react';

const getIcon = (str: string): ReactElement => {
  let IconComponent;

  switch (str.toLowerCase()) {
    case 'amazon':
      IconComponent = require('@phosphor-icons/react/lib/AmazonLogo').AmazonLogo;
      break;
    case 'android':
      IconComponent = require('@phosphor-icons/react/lib/AndroidLogo').AndroidLogo;
      break;
    case 'angular':
      IconComponent = require('@phosphor-icons/react/lib/AngularLogo').AngularLogo;
      break;
    case 'apple':
      IconComponent = require('@phosphor-icons/react/lib/AppleLogo').AppleLogo;
      break;
    case 'appstore':
      IconComponent = require('@phosphor-icons/react/lib/AppStoreLogo').AppStoreLogo;
      break;
    case 'applepodcasts':
      IconComponent = require('@phosphor-icons/react/lib/ApplePodcastsLogo').ApplePodcastsLogo;
      break;
    case 'atom':
      IconComponent = require('@phosphor-icons/react/lib/Atom').Atom;
      break;
    case 'behance':
      IconComponent = require('@phosphor-icons/react/lib/BehanceLogo').BehanceLogo;
      break;
    case 'codepen':
      IconComponent = require('@phosphor-icons/react/lib/CodepenLogo').CodepenLogo;
      break;
    case 'codesandbox':
      IconComponent = require('@phosphor-icons/react/lib/CodesandboxLogo').CodesandboxLogo;
      break;
    case 'discord':
      IconComponent = require('@phosphor-icons/react/lib/DiscordLogo').DiscordLogo;
      break;
    case 'dribbble':
      IconComponent = require('@phosphor-icons/react/lib/DribbbleLogo').DribbbleLogo;
      break;
    case 'dropbox':
      IconComponent = require('@phosphor-icons/react/lib/DropboxLogo').DropboxLogo;
      break;
    case 'facebook':
      IconComponent = require('@phosphor-icons/react/lib/FacebookLogo').FacebookLogo;
      break;
    case 'figma':
      IconComponent = require('@phosphor-icons/react/lib/FigmaLogo').FigmaLogo;
      break;
    case 'framer':
      IconComponent = require('@phosphor-icons/react/lib/FramerLogo').FramerLogo;
      break;
    case 'git':
      IconComponent = require('@phosphor-icons/react/lib/GitBranch').GitBranch;
      break;
    case 'github':
      IconComponent = require('@phosphor-icons/react/lib/GithubLogo').GithubLogo;
      break;
    case 'gitlab':
      IconComponent = require('@phosphor-icons/react/lib/GitlabLogo').GitlabLogo;
      break;
    case 'google':
      IconComponent = require('@phosphor-icons/react/lib/GoogleLogo').GoogleLogo;
      break;
    case 'chrome':
      IconComponent = require('@phosphor-icons/react/lib/GoogleChromeLogo').GoogleChromeLogo;
      break;
    case 'drive':
      IconComponent = require('@phosphor-icons/react/lib/GoogleDriveLogo').GoogleDriveLogo;
      break;
    case 'photos':
      IconComponent = require('@phosphor-icons/react/lib/GooglePhotosLogo').GooglePhotosLogo;
      break;
    case 'play':
      IconComponent = require('@phosphor-icons/react/lib/GooglePlayLogo').GooglePlayLogo;
      break;
    case 'linkedin':
      IconComponent = require('@phosphor-icons/react/lib/LinkedinLogo').LinkedinLogo;
      break;
    case 'linux':
      IconComponent = require('@phosphor-icons/react/lib/LinuxLogo').LinuxLogo;
      break;
    case 'medium':
      IconComponent = require('@phosphor-icons/react/lib/MediumLogo').MediumLogo;
      break;
    case 'messenger':
      IconComponent = require('@phosphor-icons/react/lib/MessengerLogo').MessengerLogo;
      break;
    case 'meta':
      IconComponent = require('@phosphor-icons/react/lib/MetaLogo').MetaLogo;
      break;
    case 'microsoftexcel':
      IconComponent = require('@phosphor-icons/react/lib/MicrosoftExcelLogo').MicrosoftExcelLogo;
      break;
    case 'microsoftoutlook':
      IconComponent = require('@phosphor-icons/react/lib/MicrosoftOutlookLogo').MicrosoftOutlookLogo;
      break;
    case 'microsoftpowerpoint':
      IconComponent = require('@phosphor-icons/react/lib/MicrosoftPowerpointLogo').MicrosoftPowerpointLogo;
      break;
    case 'microsoftteams':
      IconComponent = require('@phosphor-icons/react/lib/MicrosoftTeamsLogo').MicrosoftTeamsLogo;
      break;
    case 'microsoftword':
      IconComponent = require('@phosphor-icons/react/lib/MicrosoftWordLogo').MicrosoftWordLogo;
      break;
    case 'notion':
      IconComponent = require('@phosphor-icons/react/lib/NotionLogo').NotionLogo;
      break;
    case 'patreon':
      IconComponent = require('@phosphor-icons/react/lib/PatreonLogo').PatreonLogo;
      break;
    case 'paypal':
      IconComponent = require('@phosphor-icons/react/lib/PaypalLogo').PaypalLogo;
      break;
    case 'phosphor':
      IconComponent = require('@phosphor-icons/react/lib/PhosphorLogo').PhosphorLogo;
      break;
    case 'pinterest':
      IconComponent = require('@phosphor-icons/react/lib/PinterestLogo').PinterestLogo;
      break;
    case 'reddit':
      IconComponent = require('@phosphor-icons/react/lib/RedditLogo').RedditLogo;
      break;
    case 'slack':
      IconComponent = require('@phosphor-icons/react/lib/SlackLogo').SlackLogo;
      break;
    case 'snapchat':
      IconComponent = require('@phosphor-icons/react/lib/SnapchatLogo').SnapchatLogo;
      break;
    case 'soundcloud':
      IconComponent = require('@phosphor-icons/react/lib/SoundcloudLogo').SoundcloudLogo;
      break;
    case 'spotify':
      IconComponent = require('@phosphor-icons/react/lib/SpotifyLogo').SpotifyLogo;
      break;
    case 'stackoverflow':
      IconComponent = require('@phosphor-icons/react/lib/StackOverflowLogo').StackOverflowLogo;
      break;
    case 'stripe':
      IconComponent = require('@phosphor-icons/react/lib/StripeLogo').StripeLogo;
      break;
    case 'telegram':
      IconComponent = require('@phosphor-icons/react/lib/TelegramLogo').TelegramLogo;
      break;
    case 'tiktok':
      IconComponent = require('@phosphor-icons/react/lib/TiktokLogo').TiktokLogo;
      break;
    case 'twitch':
      IconComponent = require('@phosphor-icons/react/lib/TwitchLogo').TwitchLogo;
      break;
    case 'twitter':
      IconComponent = require('@phosphor-icons/react/lib/TwitterLogo').TwitterLogo;
      break;
    case 'webhooks':
      IconComponent = require('@phosphor-icons/react/lib/WebhooksLogo').WebhooksLogo;
      break;
    case 'whatsapp':
      IconComponent = require('@phosphor-icons/react/lib/WhatsappLogo').WhatsappLogo;
      break;
    case 'windows':
      IconComponent = require('@phosphor-icons/react/lib/WindowsLogo').WindowsLogo;
      break;
    case 'youtube':
      IconComponent = require('@phosphor-icons/react/lib/YoutubeLogo').YoutubeLogo;
      break;
    default:
      IconComponent = require('@phosphor-icons/react/lib/Link').Link;
      break;
  }

  return <IconComponent size={32} weight="duotone" />;
};

export default getIcon;
