import "./StarRating.css";

interface StarRatingProps {
  value: number; // 0 a 5
  onChange?: (stars: number) => void; // se passado, vira interativo
  size?: number;
}

// Átomo (atomic design): menor peça reutilizável da UI.
export function StarRating({ value, onChange, size = 22 }: StarRatingProps) {
  return (
    <div className="stars" aria-label={`Nota ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= value ? "star filled" : "star"}
          style={{ fontSize: size }}
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          title={`${star} estrela(s)`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
