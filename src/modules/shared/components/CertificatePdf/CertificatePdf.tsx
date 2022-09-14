import { ReactNode } from 'react';

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Link,
  Font,
} from '@react-pdf/renderer';

import InterBold from '../../../../../public/fonts/Inter/Inter-Bold.ttf';
import InterMedium from '../../../../../public/fonts/Inter/Inter-Medium.ttf';
import InterRegular from '../../../../../public/fonts/Inter/Inter-Regular.ttf';
import InterSemibold from '../../../../../public/fonts/Inter/Inter-SemiBold.ttf';
import contractAddressIcon from '../../assets/images/contractAddressIcon.png';
import fromIcon from '../../assets/images/fromIcon.png';
import transactionIcon from '../../assets/images/transactionIcon.png';
import w3blockLogo from '../../assets/images/w3blockHorizontal.png';

interface TokenCertificateTranslations {
  header: {
    line1: string;
    line2: string;
  };
  collectionData: {
    titleLabel: string;
    descriptionLabel: string;
  };
  QRCodeScanMessage: string;
  metaData: {
    contractAddressLabel: string;
    transcationHashLabel: string;
  };
}

interface Props {
  name: string;
  description?: string;
  contractAddress: string;
  transactionHash: string;
  ownerAddress: string;
  QRCodeImageSrc: string;
  imageSrc: string;
  translations: TokenCertificateTranslations;
}

interface ListItemProps {
  title: string;
  description: string;
  isLast?: boolean;
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    position: 'relative',
    padding: '32 0 120',
  },
  titleWrapper: {
    borderColor: '#000000',
    borderStyle: 'solid',
    borderTop: 1,
    margin: '40 32 24 0',
    paddingTop: 16,
  },
  contentWrapper: {
    flexDirection: 'row',
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: 700,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  itemContentContainer: {
    flex: 1,
    position: 'relative',
    paddingRight: 29,
  },
  itemTitleContainer: {
    fontSize: 14,
  },
  itemTitle: {
    fontWeight: 600,
  },
  itemDescription: {
    fontWeight: 400,
  },
  QRCodeContainer: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'center',
  },
  QRCode: {
    width: 70,
    height: 70,
  },
  QRCodeText: {
    marginLeft: 8,
    fontWeight: 500,
    fontSize: 12,
  },
  metadataSection: {
    padding: 16,
    marginTop: 43,
    backgroundColor: '#FFFFFF',
  },
  collectionImage: {
    position: 'relative',
    left: 32,
    objectFit: 'contain',
    maxWidth: 220,
    maxHeight: 293,
  },
  imageBorder: {
    position: 'relative',
    bottom: 16,
    borderColor: '#000000',
    borderTop: 1,
    borderRight: 1,
    borderBottom: 1,
    padding: '24 0',
  },
  headerLineDecorator: {
    height: 1,
    backgroundColor: '#000000',
    marginRight: 32,
    marginLeft: 32,
  },
});

const listItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  text: {
    fontWeight: 600,
    fontSize: 10,
  },
  description: {
    fontSize: 10,
    fontWeight: 400,
  },
});

const footerStyles = StyleSheet.create({
  logo: {
    width: 200,
    height: 32,
  },
  link: {
    fontSize: 10,
    color: '#000000',
    textDecoration: 'none',
    marginTop: 8,
  },
  title: {
    fontSize: 12,
    marginBottom: 8,
  },
  container: {
    position: 'absolute',
    bottom: 32,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: InterRegular,
      fontStyle: 'normal',
      fontWeight: 400,
    },
    {
      src: InterMedium,
      fontStyle: 'normal',
      fontWeight: 500,
    },
    {
      src: InterSemibold,
      fontStyle: 'normal',
      fontWeight: 600,
    },
    {
      src: InterBold,
      fontStyle: 'normal',
      fontWeight: 700,
    },
  ],
});

const Container = ({ children }: { children: ReactNode }) => (
  <View
    style={{
      margin: '0 32',
    }}
  >
    {children}
  </View>
);

const ListItem = ({
  description,
  title,
  imageHeight,
  imageSrc,
  imageWidth,
  isLast = false,
}: ListItemProps) => {
  return (
    <View
      style={{
        ...listItemStyles.container,
        marginBottom: isLast ? 0 : 9,
      }}
    >
      <Image
        src={imageSrc}
        style={{
          width: imageWidth,
          height: imageHeight,
        }}
      />
      <View style={listItemStyles.textContainer}>
        <Text style={listItemStyles.text}>{title}: </Text>
        <Text style={listItemStyles.description}>{description}</Text>
      </View>
    </View>
  );
};

const Footer = () => {
  return (
    <View style={footerStyles.container} fixed>
      <Text style={footerStyles.title}>Powered by</Text>

      <Image src={w3blockLogo} style={footerStyles.logo} />
      <Link src="www.w3block.io" style={footerStyles.link}>
        w3block.io
      </Link>
    </View>
  );
};

export const CertificatePdf = ({
  QRCodeImageSrc,
  contractAddress,
  description,
  name,
  ownerAddress,
  transactionHash,
  imageSrc,
  translations,
}: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View fixed style={styles.headerLineDecorator} />
        <View
          style={{
            flex: 1,
            marginTop: 24,
          }}
        >
          <View style={{ marginBottom: 40 }}>
            <Container>
              <Text style={styles.title}>{translations.header.line1}</Text>
              <Text style={styles.title}>{translations.header.line2}</Text>
            </Container>
          </View>

          <View style={styles.contentWrapper}>
            <View
              style={{
                marginRight: 56,
              }}
            >
              <View style={styles.imageBorder}>
                <Image style={styles.collectionImage} src={imageSrc} />
              </View>
            </View>
            <View style={styles.itemContentContainer}>
              <View
                style={{
                  marginBottom: description ? 24 : 0,
                }}
              >
                <Text style={styles.itemTitleContainer}>
                  <Text style={styles.itemTitle}>
                    {translations.collectionData.titleLabel}:{' '}
                  </Text>
                  <Text style={styles.itemDescription}>{name}</Text>
                </Text>
              </View>

              {description ? (
                <View style={{ backgroundColor: 'white' }}>
                  <Text style={styles.itemTitleContainer}>
                    <Text style={styles.itemTitle}>
                      {translations.collectionData.descriptionLabel}:{' '}
                    </Text>
                    <Text style={styles.itemDescription}>{description}</Text>
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <Container>
            <View style={styles.metadataSection} wrap={false}>
              <View style={styles.QRCodeContainer}>
                <Image src={QRCodeImageSrc || imageSrc} style={styles.QRCode} />
                <Text style={styles.QRCodeText}>
                  {translations.QRCodeScanMessage}
                </Text>
              </View>
              <ListItem
                imageSrc={contractAddressIcon}
                imageHeight={12}
                imageWidth={12}
                title={translations.metaData.contractAddressLabel}
                description={contractAddress}
              />
              <ListItem
                imageSrc={transactionIcon}
                imageWidth={12}
                imageHeight={11}
                title={translations.metaData.transcationHashLabel}
                description={transactionHash}
              />
              {ownerAddress && (
                <ListItem
                  imageSrc={fromIcon}
                  imageWidth={12}
                  imageHeight={11}
                  title={'From'}
                  description={ownerAddress}
                  isLast
                />
              )}
            </View>
          </Container>
        </View>

        <Footer />
      </Page>
    </Document>
  );
};
