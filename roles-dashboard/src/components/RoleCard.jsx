import React from 'react';
import { formatToList, getBadgeColor } from '../utils/utils';

/**
 * RoleCard Component: Displays individual role details.
 * Follows semantic HTML and accessibility standards.
 */
const RoleCard = ({ role, onFilterClick }) => {
    const responsibilities = formatToList(role.responsibilities);
    const skills = formatToList(role.skills);
    const industries = role.industry ? role.industry.split(',').map(i => i.trim()) : [];
    const orgLevel = role['org-level']?.trim();
    const medium = role.medium?.trim();

    return (
        <article className="role-card" aria-labelledby={`role-title-${role.id}`}>
            <header className="role-card__header">
                <h3 id={`role-title-${role.id}`} className="role-card__title">
                    {role['role-name']}
                </h3>
                <div className="role-card__badges">
                    {orgLevel && (
                        <button
                            type="button"
                            className="badge badge--level"
                            style={{ '--badge-color': getBadgeColor(orgLevel) }}
                            onClick={() => onFilterClick('level', orgLevel)}
                            aria-label={`Filter by level: ${orgLevel}`}
                        >
                            {orgLevel}
                        </button>
                    )}
                    {medium && (
                        <button
                            type="button"
                            className="badge badge--medium"
                            style={{ '--badge-color': getBadgeColor(medium) }}
                            onClick={() => onFilterClick('medium', medium)}
                            aria-label={`Filter by medium: ${medium}`}
                        >
                            {medium}
                        </button>
                    )}
                </div>
            </header>

            <div className="role-card__body">
                <p className="role-card__description">{role.description}</p>

                {responsibilities.length > 0 && (
                    <section className="role-card__section">
                        <h4>Responsibilities</h4>
                        <ul className="role-card__list">
                            {responsibilities.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {skills.length > 0 && (
                    <section className="role-card__section">
                        <h4>Skills</h4>
                        <div className="role-card__skill-tags">
                            {skills.map((skill, idx) => (
                                <span key={idx} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <footer className="role-card__footer">
                <div className="role-card__industries">
                    {industries.map((industry, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className="industry-tag"
                            onClick={() => onFilterClick('industry', industry)}
                            aria-label={`Filter by industry: ${industry}`}
                        >
                            {industry}
                        </button>
                    ))}
                </div>
            </footer>
        </article>
    );
};

export default RoleCard;
