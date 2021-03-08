import React from 'react';

const Popup = (props) => {
  return (
    <div className="popup-box">
      <div className="box">
        <>
          <span className="close-icon" onClick={props.handleClose}>
            x
          </span>
          <div className="content-container">
            <b>project info</b>
            <div>
              <input onChange={props.onChange} />
            </div>
            <div></div>
            <button onClick={props.onSave}>continue</button>
          </div>
        </>
      </div>
    </div>
  );
};

export default Popup;
