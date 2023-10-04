import ArrowLeftIcon from '../../../shared/assets/icons/arrowLeftOutlined.svg?react';
import { Link } from '../../../shared/components/Link';
import useRouter from '../../../shared/hooks/useRouter';

interface BreadcrumbProps {
  breadcrumbItems: Array<BreadcrumbItemProps>;
}

export interface BreadcrumbItemProps {
  url: string;
  name: string;
}

const BreadcrumbItem = ({
  url,
  name,
  index,
  isLast,
}: {
  url: string;
  name: string;
  index: number;
  isLast: boolean;
}) => {
  return (
    <>
      <li
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
        key={index}
      >
        <Link href={url} className="">
          <span itemProp="name" className="">
            {name}
          </span>
        </Link>
        <meta itemProp="position" content={index.toString()} />
      </li>

      {isLast ? '' : <span>{'>'}</span>}
    </>
  );
};

export const Breadcrumb = ({ breadcrumbItems }: BreadcrumbProps) => {
  const router = useRouter();
  return (
    <nav className="pw-breadcrumb pw-flex pw-items-center pw-gap-6 pw-mb-6">
      <ArrowLeftIcon
        className="pw-stroke-[#353945] pw-cursor-pointer"
        onClick={() => router.back()}
      />

      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="pw-flex pw-items-center pw-gap-1 pw-text-[#777E8F] pw-text-[13px] pw-font-poppins pw-font-normal"
      >
        {breadcrumbItems.map((item, index, array) => (
          <BreadcrumbItem
            {...item}
            index={index + 1}
            isLast={array.length - 1 === index}
            key={index}
          />
        ))}
      </ol>
    </nav>
  );
};
