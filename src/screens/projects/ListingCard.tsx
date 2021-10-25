import React from 'react';
import CheckBox from '../../components/CheckBox';

const ListingCard = ({
  projects,
  showSelect,
  openPath,
  onDeleteNodeModules,
  onCheck,
  cancellAllSelected,
  ...props
}) => {
  return (
    <div className="listing-container">
      {projects &&
        projects?.electron.map((item) => (
          <div className="card">
            <div className="info">
              {showSelect && (
                <div className="">
                  <CheckBox
                    id={`checkbox-id${item.path}`}
                    cancellAllSelected={cancellAllSelected}
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
                <button
                  onClick={() => openPath(item)}
                  style={{ color: '#303030' }}
                >
                  OPEN
                </button>
              )}

              <button
                onClick={() => onDeleteNodeModules(item)}
                style={{ color: item.id > 2 ? '#E5E5E5' : undefined }}
              >
                CLEAN
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ListingCard;
