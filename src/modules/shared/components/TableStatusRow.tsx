import { ReactNode } from 'react';

interface Props {
  /** Number of columns the status cell must span. */
  colSpan: number;
  className?: string;
  children?: ReactNode;
}

/**
 * Status area of a table (empty, error, loading). It is a real table row:
 * a <div> placed directly inside <table> is invalid HTML, the browser hoists
 * it out of the table while parsing the server HTML, and React then fails
 * hydration and re-renders the page from its nearest Suspense fallback.
 */
export const TableStatusRow = ({ colSpan, className, children }: Props) => (
  <tbody>
    <tr>
      <td colSpan={colSpan} className="pw-p-0">
        <div className={className}>{children}</div>
      </td>
    </tr>
  </tbody>
);
