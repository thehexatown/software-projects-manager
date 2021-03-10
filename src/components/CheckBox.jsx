import React from 'react';

export const CheckBox = (props) => {
  return (
    <input
      key={props.id}
      onClick={props.onCheck}
      type="checkbox"
      // checked={true}
      value={props.value}
    />
  );
};

export default CheckBox;
