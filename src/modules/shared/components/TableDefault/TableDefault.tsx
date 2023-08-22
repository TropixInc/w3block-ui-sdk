import { ReactNode } from 'react';

interface TableDefaultProps {
  data: any[];
  header: TableHeaderItem[];
  className?: string;
  headerColor?: string;
  headerTextColor?: string;
}

export interface TableHeaderItem {
  name: string;
  key: string;
  component?: (data: any) => ReactNode;
  align?: 'left' | 'center' | 'right';
}
export const TableDefault = ({
  data,
  header,
  className = '',
  headerColor = '#295BA6',
  headerTextColor = 'white',
}: TableDefaultProps) => {
  return (
    <div className={`pw-w-full pw-rounded-lg pw-overflow-hidden ${className}`}>
      <table className={`pw-w-full`}>
        <tr
          style={{
            backgroundColor: headerColor,
          }}
        >
          {header.map((item) => (
            <th
              align={item.align ?? 'left'}
              key={item.key}
              style={{ color: headerTextColor }}
              className="pw-px-[16px] pw-py-[10px] pw-text-sm pw-font-semibold"
            >
              {item.name}
            </th>
          ))}
        </tr>
        {data.map((item, index) => (
          <tr key={index} className={`pw-bg-white`}>
            {header.map((headerItem) => (
              <td
                align={headerItem.align ?? 'left'}
                key={headerItem.key}
                className="pw-px-[16px] pw-py-[10px] pw-border-b pw-border-gray-200"
              >
                {headerItem.component ? (
                  headerItem.component(item)
                ) : (
                  <p className="pw-text-slate-500 pw-text-sm pw-font-semibold">
                    {item[headerItem.key]}
                  </p>
                )}
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
};
