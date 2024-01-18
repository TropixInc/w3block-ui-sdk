export enum SocialsEnum {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedIn',
  INSTAGRAM = 'instagram',
  DISCORD = 'discord',
  WEBSITE = 'website',
}

const socials = [
  SocialsEnum.LINKEDIN,
  SocialsEnum.FACEBOOK,
  SocialsEnum.TWITTER,
  SocialsEnum.INSTAGRAM,
  SocialsEnum.DISCORD,
  SocialsEnum.WEBSITE,
];

const getSocialImage = (social: SocialsEnum) => {
  switch (social) {
    case SocialsEnum.LINKEDIN:
      return 'https://res.cloudinary.com/tropix/image/upload/v1705091454/wwjjc/assets/social/linkedin_lfwfel.png';
    case SocialsEnum.FACEBOOK:
      return 'https://res.cloudinary.com/tropix/image/upload/v1705091454/wwjjc/assets/social/facebook_ozkgbn.png';
    case SocialsEnum.TWITTER:
      return 'https://res.cloudinary.com/tropix/image/upload/v1705091454/wwjjc/assets/social/twitter_wzpbpa.png';
    case SocialsEnum.INSTAGRAM:
      return 'https://res.cloudinary.com/tropix/image/upload/v1705091454/wwjjc/assets/social/instagram_ldithb.png';
    case SocialsEnum.DISCORD:
      return 'https://res.cloudinary.com/tropix/image/upload/v1705091453/wwjjc/assets/social/discord_uydg7v.png';
    case SocialsEnum.WEBSITE:
      return 'https://res.cloudinary.com/tropix/image/upload/v1705091455/wwjjc/assets/social/website_o8b1sf.png';
    default:
      return '';
  }
};

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  title: string;
}

export const SocialNetworks = ({ data, title }: Props) => {
  if (data)
    return (
      <>
        <p className="pw-font-normal pw-text-black pw-text-sm pw-font-poppins">
          {title}
        </p>
        <div className="pw-flex pw-gap-3">
          {socials.map((res, index) => {
            const availableSocial = data[res];
            if (availableSocial)
              return (
                <a
                  target="_blank"
                  href={availableSocial}
                  key={index}
                  rel="noreferrer"
                >
                  <img src={getSocialImage(res)} width={24} height={24} />
                </a>
              );
          })}
        </div>
      </>
    );
  else return null;
};
