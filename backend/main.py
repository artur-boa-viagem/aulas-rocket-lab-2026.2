import sqlite3
from datetime import datetime
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Response, status
from pydantic import BaseModel, Field

from database import create_tables, get_db


app = FastAPI(title="Game Reviews API")
create_tables()


class Game(BaseModel):
    id: int
    title: str
    synopsis: str | None
    cover_url: str | None


class ReviewCreate(BaseModel):
    user_id: int
    rating: Annotated[int, Field(ge=1, le=5)]
    review_text: str | None = None
    times_completed: Annotated[int, Field(ge=0)] = 0


class ReviewUpdate(BaseModel):
    rating: Annotated[int, Field(ge=1, le=5)] | None = None
    review_text: str | None = None
    times_completed: Annotated[int, Field(ge=0)] | None = None


class Review(BaseModel):
    id: int
    user_id: int
    user_name: str
    game_id: int
    rating: int
    review_text: str | None
    times_completed: int
    created_at: datetime
    updated_at: datetime


def find_review(review_id: int, db: sqlite3.Connection) -> dict:
    review = db.execute(
        """
        SELECT reviews.*, users.name AS user_name
        FROM reviews
        JOIN users ON users.id = reviews.user_id
        WHERE reviews.id = ?
        """,
        (review_id,),
    ).fetchone()

    if review is None:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")

    return dict(review)


@app.get("/")
def home():
    return {"message": "API funcionando"}


@app.get("/games", response_model=list[Game])
def list_games(db: sqlite3.Connection = Depends(get_db)):
    games = db.execute("SELECT * FROM games ORDER BY id").fetchall()
    return [dict(game) for game in games]


@app.get("/games/{game_id}", response_model=Game)
def get_game(game_id: int, db: sqlite3.Connection = Depends(get_db)):
    game = db.execute("SELECT * FROM games WHERE id = ?", (game_id,)).fetchone()

    if game is None:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")

    return dict(game)


@app.get("/games/{game_id}/reviews", response_model=list[Review])
def list_reviews(game_id: int, db: sqlite3.Connection = Depends(get_db)):
    game = db.execute("SELECT id FROM games WHERE id = ?", (game_id,)).fetchone()
    if game is None:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")

    reviews = db.execute(
        """
        SELECT reviews.*, users.name AS user_name
        FROM reviews
        JOIN users ON users.id = reviews.user_id
        WHERE reviews.game_id = ?
        ORDER BY reviews.created_at DESC, reviews.id DESC
        """,
        (game_id,),
    ).fetchall()
    return [dict(review) for review in reviews]


@app.post(
    "/games/{game_id}/reviews",
    response_model=Review,
    status_code=status.HTTP_201_CREATED,
)
def create_review(
    game_id: int,
    data: ReviewCreate,
    db: sqlite3.Connection = Depends(get_db),
):
    game = db.execute("SELECT id FROM games WHERE id = ?", (game_id,)).fetchone()
    if game is None:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")

    user = db.execute("SELECT id FROM users WHERE id = ?", (data.user_id,)).fetchone()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    try:
        cursor = db.execute(
            """
            INSERT INTO reviews
                (user_id, game_id, rating, review_text, times_completed)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                data.user_id,
                game_id,
                data.rating,
                data.review_text,
                data.times_completed,
            ),
        )
        db.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=409, detail="Usuário já avaliou este jogo"
        ) from None

    return find_review(cursor.lastrowid, db)


@app.patch("/reviews/{review_id}", response_model=Review)
def update_review(
    review_id: int,
    data: ReviewUpdate,
    db: sqlite3.Connection = Depends(get_db),
):
    find_review(review_id, db)
    changes = data.model_dump(exclude_unset=True)

    if not changes:
        raise HTTPException(status_code=400, detail="Nenhum campo enviado")
    if changes.get("rating", 1) is None or changes.get("times_completed", 0) is None:
        raise HTTPException(status_code=422, detail="Campo não pode ser nulo")

    assignments = ", ".join(f"{field} = ?" for field in changes)
    values = [*changes.values(), review_id]
    db.execute(
        f"UPDATE reviews SET {assignments}, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        values,
    )
    db.commit()

    return find_review(review_id, db)


@app.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: sqlite3.Connection = Depends(get_db),
):
    find_review(review_id, db)
    db.execute("DELETE FROM reviews WHERE id = ?", (review_id,))
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
