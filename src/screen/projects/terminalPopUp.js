import React from 'react';

const Popup = (props) => {
  return (
    <div className="popup-terminal">
      <div className="box-terminal">
        {props.showClose && (
          <span className="close-icon" onClick={props.handleClose}>
            x
          </span>
        )}
        {props.content}
      </div>
    </div>
  );
};

export default Popup;
