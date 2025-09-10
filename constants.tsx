
import React from 'react';

const BullHeadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.17V14h-2v-2h2v-1.17c0-2.09 1.26-3.21 3.12-3.21.88 0 1.64.07 1.87.1v1.9h-1.1c-1.01 0-1.2.48-1.2 1.18V12h2.22l-.28 2h-1.94v2.17c-2.03.74-4 .1-4 0z" fill="none"/>
        <path d="M15.5,5.5 C14.53,4.53 13.27,4 12,4 C8.69,4 6,6.69 6,10 L6,11 C6,12.11 6.89,13 8,13 L8.1,13 C7.55,14.16 6.5,15 6.5,15 C5.5,16 5.5,17.5 5.5,17.5 C5.5,18.328 6.172,19 7,19 C7.828,19 8.5,18.328 8.5,17.5 L8.5,16.5 L15.5,16.5 L15.5,17.5 C15.5,18.328 16.172,19 17,19 C17.828,19 18.5,18.328 18.5,17.5 C18.5,17.5 18.5,16 17.5,15 C17.5,15 16.45,14.16 15.9,13 L16,13 C17.11,13 18,12.11 18,11 L18,10 C18,6.69 15.31,4 12,4 M12,6 C14.21,6 16,7.79 16,10 L16,11 L8,11 L8,10 C8,7.79 9.79,6 12,6 Z"/>
    </svg>
);


export const AVATARS: { id: string, component: React.FC<{className?: string}> }[] = [
    { id: 'bull_1', component: ({ className }) => <BullHeadIcon className={`${className} text-red-500`} /> },
    { id: 'bull_2', component: ({ className }) => <BullHeadIcon className={`${className} text-blue-500`} /> },
    { id: 'bull_3', component: ({ className }) => <BullHeadIcon className={`${className} text-green-500`} /> },
    { id: 'bull_4', component: ({ className }) => <BullHeadIcon className={`${className} text-yellow-500`} /> },
    { id: 'bull_5', component: ({ className }) => <BullHeadIcon className={`${className} text-purple-500`} /> },
    { id: 'bull_6', component: ({ className }) => <BullHeadIcon className={`${className} text-pink-500`} /> },
    { id: 'bull_7', component: ({ className }) => <BullHeadIcon className={`${className} text-indigo-500`} /> },
    { id: 'bull_8', component: ({ className }) => <BullHeadIcon className={`${className} text-teal-500`} /> },
    { id: 'user', component: ({ className }) => (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    )},
];

export const getAvatarComponent = (avatarId: string | undefined) => {
    const avatar = AVATARS.find(a => a.id === avatarId);
    if (avatar) {
        return avatar.component;
    }
    return AVATARS.find(a => a.id === 'user')!.component;
};
