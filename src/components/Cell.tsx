import React, { FC, memo } from 'react';

import { CellType } from '../core/types';

interface IProps {
  cellType: CellType,
}

const Row: FC<IProps> = ({ cellType }) => <td className={`cell ${cellType}`}></td>;

export default memo(Row);

// @ts-ignore
Row.whyDidYouRender = true
