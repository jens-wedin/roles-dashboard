import React from 'react';

const RoleList = ({ roles }) => {
  // Helper function to generate a consistent color for badges
  const getBadgeColor = (text) => {
    if (!text) return '#cccccc'; // Default gray for empty
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  return (
    <div>
      <h2>Design Roles</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {roles.map((role) => (
          <div key={role.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', boxShadow: '2px 2px 8px rgba(0,0,0,0.1)' }}>
            <h3>{role.role_name}</h3>
            <p><strong>Description:</strong> {role.description}</p>

            {role.responsibilities && (
              <p><strong>Responsibilities:</strong> {role.responsibilities}</p>
            )}
            {role.skills && (
              <p><strong>Skills:</strong> {role.skills}</p>
            )}

            <div style={{ margin: '10px 0' }}>
              {role.industry && role.industry.split(',').map((item, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: getBadgeColor(item.trim()),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    marginRight: '5px',
                    marginBottom: '5px',
                    display: 'inline-block',
                    fontSize: '0.8em',
                  }}
                >
                  {item.trim()}
                </span>
              ))}
              {role['org-level'] && (
                <span
                  style={{
                    backgroundColor: getBadgeColor(role['org-level']),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    marginRight: '5px',
                    marginBottom: '5px',
                    display: 'inline-block',
                    fontSize: '0.8em',
                  }}
                >
                  {role['org-level']}
                </span>
              )}
              {role.medium && (
                <span
                  style={{
                    backgroundColor: getBadgeColor(role.medium),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    marginRight: '5px',
                    marginBottom: '5px',
                    display: 'inline-block',
                    fontSize: '0.8em',
                  }}
                >
                  {role.medium}
                </span>
              )}
            </div>

            {Object.keys(role).map((key) => {
              const excludedKeys = ['id', 'role_name', 'description', 'responsibilities', 'skills', 'industry', 'org-level', 'medium'];
              if (!excludedKeys.includes(key) && role[key] !== null) {
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
