import React from 'react';
import RoleCard from './RoleCard';

/**
 * RoleList Component: Container for rendering the list of roles.
 */
const RoleList = ({ roles, onFilterClick }) => {
  return (
    <section className="role-list-container" aria-labelledby="roles-heading">
      <h2 id="roles-heading" className="sr-only">Design Roles List</h2>

      {roles.length === 0 ? (
        <div className="no-results">
          <p>No roles match your current filters.</p>
        </div>
      ) : (
        <div className="role-grid">
          {roles.map((role) => (
            <RoleCard 
              key={role.id} 
              role={role} 
              onFilterClick={onFilterClick}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RoleList;
