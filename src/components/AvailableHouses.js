import React from 'react';
import HouseCard from './HouseCard';

function AvailableHouses({ houses }) {
    return (
        <div>
            <h2>Available Houses for Rent</h2>
            <div className="house-list">
                {houses.map((house, index) => (
                    <HouseCard key={index} house={house} />
                ))}
            </div>
        </div>
    );
}

export default AvailableHouses;
