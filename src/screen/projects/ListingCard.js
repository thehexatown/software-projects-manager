import React from 'react'
import { PROJECT_LISTING } from '../../constants/mock'

const ListingCard = () => {
  return (
    <div className="listing-container">
    {PROJECT_LISTING.map((item) => (
      <div className="card">
        <div className="info">
          <h3>{item.name}</h3>
          <h5>{item.path}</h5>
        </div>
        <div className="actions">
        
          {item.id < 3 && (
            <span>
              <h6 style={{ color: "#303030" }}>OPEN</h6>
            </span>
          )}
     
          <span>
            <h6 style={{color:item.id>2?'#E5E5E5':undefined}}>CLEAN</h6>
          </span>
        </div>
      </div>
    ))}
  </div>
  )
}

export default ListingCard

