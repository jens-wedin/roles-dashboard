/* --- BAD CODE (Junior/Standard) --- */
function role_item(props) {
    return (
        <div onClick={() => alert(props.name)} style={{ border: '1px solid red' }}>
            <img src={props.img} />
            <h3>{props.name}</h3>
            <p>{props.desc}</p>
        </div>
    );
}

/* --- GOOD CODE (Senior/Standard) --- */
import React, { useCallback, useMemo } from 'react';

interface RoleItemProps {
    name: string;
    description: string;
    imageUrl?: string;
    onSelect: (name: string) => void;
}

/**
 * RoleCard: Follows coding standard skill.
 * - TypeScript for safety.
 * - Semantic HTML (article).
 * - Accessibility (button, alt text).
 * - Performance (useCallback).
 * - Premium styling (CSS variables, transitions).
 */
export const RoleCard: React.FC<RoleCardProps> = ({
    name,
    description,
    imageUrl,
    onSelect
}) => {
    const handleClick = useCallback(() => {
        onSelect(name);
    }, [name, onSelect]);

    return (
        <article className="role-card" aria-labelledby={`role-title-${name}`}>
            <div className="role-card__image-container">
                <img
                    src={imageUrl || '/default-role.png'}
                    alt={`Visual representation of the ${name} role`}
                    loading="lazy"
                />
            </div>

            <div className="role-card__content">
                <h3 id={`role-title-${name}`} className="role-card__title">
                    {name}
                </h3>
                <p className="role-card__description">{description}</p>

                <button
                    onClick={handleClick}
                    className="role-card__action-btn"
                    aria-label={`View details for ${name}`}
                >
                    View Role
                </button>
            </div>
        </article>
    );
};
