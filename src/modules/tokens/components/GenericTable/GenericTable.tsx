import useRouter from '../../../shared/hooks/useRouter';
import useTranslation from '../../../shared/hooks/useTranslation';
import TableHeader from '../TableHeader/TableHeader';
import TableRows from '../TableRow/TableRow';

export type ColumnType<T, K extends keyof T> = {
  key: K;
  header: string;
  width?: number;
};

export type TableProps<T, K extends keyof T> = {
  data: Array<T>;
  columns: Array<ColumnType<T, K>>;
  limitRowsNumber?: number;
};

const GenericTable = <T, K extends keyof T>({
  data,
  columns,
  limitRowsNumber = data?.length,
}: TableProps<T, K>): JSX.Element => {
  const [translate] = useTranslation();
  const router = useRouter();
  return (
    <div className="pw-w-full pw-flex pw-flex-col pw-gap-[16px]">
      <div className="pw-w-full pw-shadow-[2px_2px_10px_rgba(0,0,0,0.08)] ">
        <TableHeader columns={columns} />
        <TableRows
          data={data}
          columns={columns}
          limitRowsNumber={limitRowsNumber}
        />
      </div>
      {limitRowsNumber !== data?.length ? (
        <div className="pw-w-full pw-flex pw-items-center pw-justify-end">
          <span
            className="pw-text-brand-primary pw-text-xs pw-font-medium pw-font-poppins pw-cursor-pointer"
            onClick={() => router.push(`${router.asPath}/list-benefits`)}
          >
            {translate('connect>GenericTable>seeMore')}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default GenericTable;
