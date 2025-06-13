import classNames from 'classnames';

interface Crumbs {
  title?: string;
  href?: string;
}

interface BreadCrumbProps {
  crumbs: Crumbs[];
  className?: string;
}

export const BreadCrumb = ({ crumbs, className }: BreadCrumbProps) => {
  return (
    <div className={classNames('pw-text-white', className)}>
      {crumbs.map((crm, index) => {
        return (
          <a
            className={`pw-text-xs pw-font-poppins ${
              crumbs.length === index ? 'pw-font-semibold' : 'pw-font-normal'
            } pw-text-black`}
            key={index}
            href={crm.href}
          >
            {index === 0 ? '' : ' . '}
            {crm.title}
          </a>
        );
      })}
    </div>
  );
};
