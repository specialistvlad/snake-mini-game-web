import React, { FC, memo } from 'react';

import { CellType } from '../core/types';

interface IProps {
  cellType: CellType,
}

const CellCssGrid: FC<IProps> = ({ cellType }) => <div className={`cell-type-${cellType.toString()}`}></div>;

export default memo(CellCssGrid);

// @ts-ignore
CellCssGrid.whyDidYouRender = true
