
import React from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center">
            {icon && <div className="mr-4 text-orange-500">{icon}</div>}
            <div>
                <p className="text-sm text-gray-400">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
