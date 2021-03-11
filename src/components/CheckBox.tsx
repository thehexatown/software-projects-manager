import React from 'react';

export const CheckBox = (props) => {
  return (
    <input
      key={props.id}
      onClick={props.onCheck}
      type="checkbox"
      // checked={props.cancellAllSelected ? false : undefined}
      value={props.value}
    />
  );
};

export default CheckBox;
