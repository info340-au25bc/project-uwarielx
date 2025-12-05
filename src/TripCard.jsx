import React from "react";
import { FaTrash } from "react-icons/fa";

export default function TripCard({ trip, onDelete, onClick }) {
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete(trip.id);
  };

  return (
    <article
      className="trip-card"
      onClick={onClick ? () => onClick(trip.id) : undefined}
      tabIndex={0}
      aria-label={`Saved trip: ${trip.title}`}
    >
      <header className="trip-card__header">
        <h3 className="trip-card__title">{trip.title}</h3>
        <button
          type="button"
          className="trip-card__delete-btn"
          onClick={handleDeleteClick}
          aria-label={`Delete trip: ${trip.title}`}
        >
          <FaTrash aria-hidden="true" />
        </button>
      </header>

      <p className="trip-card__destination">
        Destination: <span>{trip.destination}</span>
      </p>

      {trip.dateRange && (
        <p className="trip-card__dates">{trip.dateRange}</p>
      )}

      {trip.notes && (
        <p className="trip-card__notes">
          Notes: <span>{trip.notes}</span>
        </p>
      )}

      {trip.lastUpdated && (
        <p className="trip-card__updated">{trip.lastUpdated}</p>
      )}
    </article>
  );
}
