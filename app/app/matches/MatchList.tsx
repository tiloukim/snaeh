"use client";

interface MatchItem {
  matchId: string;
  name: string;
  photo_url: string | null;
  lastMessage: string | null;
}

export default function MatchList({ items }: { items: MatchItem[] }) {
  if (items.length === 0) {
    return (
      <div className="matches-empty">
        <div className="matches-empty-icon">&#9825;</div>
        <h2>No matches yet</h2>
        <p>Keep swiping to find your match!</p>
      </div>
    );
  }

  return (
    <div className="match-list">
      {items.map((item) => (
        <a
          key={item.matchId}
          href={`/app/chat/${item.matchId}`}
          className="match-item"
        >
          <div className="match-item-photo">
            <img
              src={item.photo_url || "/default-male.png"}
              alt={item.name}
            />
          </div>
          <div className="match-item-info">
            <span className="match-item-name">{item.name}</span>
            <span className="match-item-preview">
              {item.lastMessage ?? "Say hello!"}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
