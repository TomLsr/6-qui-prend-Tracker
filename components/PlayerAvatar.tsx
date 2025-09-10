
import React from 'react';
import { getAvatarComponent } from '../constants';

interface PlayerAvatarProps {
    avatarId: string;
    className?: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ avatarId, className = 'w-12 h-12' }) => {
    const AvatarComponent = getAvatarComponent(avatarId);
    return <AvatarComponent className={className} />;
};

export default PlayerAvatar;
