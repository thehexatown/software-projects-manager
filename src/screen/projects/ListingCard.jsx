import React from 'react';
import CheckBox from '../../components/CheckBox';
import { PROJECT_LISTING } from '../../constants/mock';

const ListingCard = ({
  projects,
  showSelect,
  openPath,
  onDeleteNodeModules,
  onCheck,
  ...props
}) => {
  // console.log('tvk', ;
  console.log('ListingCard', { projects });
  return (
    <div className="listing-container">
      {projects &&
        projects?.electron.map((item) => (
          <div className="card">
            <div className="info">
              {showSelect && (
                <div className="">
                  <CheckBox
                    onCheck={(event) => onCheck(item, event.target.checked)}
                  />
                </div>
              )}
              <div>
                <h3>{item.name}</h3>
                <h5>{item.path}</h5>
              </div>
            </div>
            <div className="actions">
              {item && (
                <span onClick={() => openPath(item)}>
                  <h6 style={{ color: '#303030' }}>OPEN</h6>
                </span>
              )}

              <span onClick={() => onDeleteNodeModules(item)}>
                <h6 style={{ color: item.id > 2 ? '#E5E5E5' : undefined }}>
                  CLEAN
                </h6>
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ListingCard;
