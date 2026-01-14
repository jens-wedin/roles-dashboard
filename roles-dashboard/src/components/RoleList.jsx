import React from 'react';

const RoleList = ({ roles }) => {
  return (
    <div>
      <h2>Design Roles</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {roles.map((role) => (
          <div key={role.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', boxShadow: '2px 2px 8px rgba(0,0,0,0.1)' }}>
            <h3>{role.role_name}</h3>
            <p><strong>Description:</strong> {role.description}</p>
            {Object.keys(role).map((key) => {
              if (key !== 'id' && key !== 'role_name' && key !== 'description' && role[key] !== null) {
                return (
                  <p key={key}>
                    <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}:</strong>{' '}
                    {typeof role[key] === 'object' ? JSON.stringify(role[key], null, 2) : role[key]}
                  </p>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleList;
