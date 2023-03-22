import { CSSProperties } from 'react';

import './GridItemArea.css';
import { useRouterConnect } from '../../shared';
import { FitImage, GridItemAreaData } from '../interfaces';

export const GridItemArea = ({ data }: { data: GridItemAreaData }) => {
  const {
    styleData: {
      backgroundColor,
      container,
      gridColumns,
      gridRows,
      Items,
      columnSizes,
      rowSizes,
    },
  } = data;

  const letters = 'abcdefghijklmnopqrst';
  const { pushConnect } = useRouterConnect();
  const getTemplateAreas = () => {
    const filledArrays = Array(parseInt(gridRows ?? '2'))
      .fill('')
      .map(() => Array(parseInt(gridColumns ?? '4')).fill('x'));
    Items?.forEach((it, index) => {
      it.quadrants?.forEach((q) => {
        const divisor = Math.floor(q / parseInt(gridColumns ?? '4'));
        const nextNumber =
          divisor == 0 ? q : q - divisor * parseInt(gridColumns ?? '4');
        if (parseInt(gridRows ?? '2') >= divisor + 1) {
          filledArrays[divisor][Math.ceil(nextNumber)] = `x${index}`;
        }
      });
    });
    const arrayThreat = filledArrays.map((arr, index) =>
      arr.map((ar, ind) => {
        if (ar == 'x') {
          return letters.at(ind + (index + 1) * parseInt(gridColumns ?? '4'));
        } else {
          return ar;
        }
      })
    );

    const map = arrayThreat.map((arr) => `"${arr.join(' ')}"`);
    return map.join(' ');
  };

  const getGridColumnSize = () => {
    if (columnSizes) {
      return columnSizes
        .split(',')
        .map((size) => (size && size != '0' ? size + 'px' : '1fr'))
        .filter((_, index) => index + 1 <= parseInt(gridColumns ?? '4'))
        .join(' ');
    } else {
      return `repeat(${gridColumns ?? 4}, 1fr)`;
    }
  };

  const getGridRowSize = () => {
    if (rowSizes) {
      return rowSizes
        .split(',')
        .map((size) => (size && size != '0' ? size + 'px' : '1fr'))
        .filter((_, index) => index + 1 <= parseInt(gridRows ?? '2'))
        .join(' ');
    } else {
      return `repeat(${gridRows ?? 2}, 1fr)`;
    }
  };

  const getImageFit = (fit: FitImage) => {
    if (fit == FitImage.CONTAIN) {
      return 'contain';
    } else if (fit == FitImage.FILL) {
      return 'fill';
    } else {
      return 'cover';
    }
  };

  return (
    <div style={{ backgroundColor }}>
      <div
        className={`${
          container == 'fullWidth' ? 'pw-w-full' : 'pw-container'
        } pw-mx-auto`}
      >
        <div
          style={
            {
              gridTemplateColumns: getGridColumnSize(),
              gridTemplateRows: getGridRowSize(),
              '--template-areas': `${getTemplateAreas()}`,
            } as CSSProperties
          }
          className="pw-w-full pw-grid grid-areas"
        >
          {Items?.map((ite, index) =>
            ite.quadrants?.some(
              (quad) =>
                quad + 1 >
                parseInt(gridRows ?? '2') * parseInt(gridColumns ?? '4')
            ) ? null : (
              <div
                className="pw-bg-orange"
                style={{ gridArea: 'x' + index, zIndex: index }}
                key={index}
              >
                <img
                  onClick={() =>
                    ite.link
                      ? ite.target == '_blank'
                        ? window.open(ite.link)
                        : pushConnect(ite.link)
                      : ''
                  }
                  style={{ objectFit: getImageFit(ite.fit ?? FitImage.COVER) }}
                  className="pw-w-full pw-h-full pw-cursor-pointer"
                  src="https://picsum.photos/400/500"
                  alt=""
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
