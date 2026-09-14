from datetime import datetime
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Response, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import create_tables, get_db
from models import Game, Review, User


app = FastAPI(title="Game Reviews API")
create_tables()


class GameResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

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


class ReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    user_name: str
    game_id: int
    rating: int
    review_text: str | None
    times_completed: int
    created_at: datetime
    updated_at: datetime


def find_review(review_id: int, db: Session) -> Review:
    review = db.get(Review, review_id)
    if review is None:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    return review


@app.get("/")
def home():
    return {"message": "API funcionando"}


@app.get("/games", response_model=list[GameResponse])
def list_games(db: Session = Depends(get_db)):
    return db.scalars(select(Game).order_by(Game.id)).all()


@app.get("/games/{game_id}", response_model=GameResponse)
def get_game(game_id: int, db: Session = Depends(get_db)):
    game = db.get(Game, game_id)
    if game is None:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")
    return game


@app.get("/games/{game_id}/reviews", response_model=list[ReviewResponse])
def list_reviews(game_id: int, db: Session = Depends(get_db)):
    if db.get(Game, game_id) is None:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")

    query = (
        select(Review)
        .where(Review.game_id == game_id)
        .order_by(Review.created_at.desc(), Review.id.desc())
    )
    return db.scalars(query).all()


@app.post(
    "/games/{game_id}/reviews",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_review(
    game_id: int,
    data: ReviewCreate,
    db: Session = Depends(get_db),
):
    if db.get(Game, game_id) is None:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")
    if db.get(User, data.user_id) is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    review = Review(game_id=game_id, **data.model_dump())
    db.add(review)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409, detail="Usuário já avaliou este jogo"
        ) from None

    db.refresh(review)
    return review


@app.patch("/reviews/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: int,
    data: ReviewUpdate,
    db: Session = Depends(get_db),
):
    review = find_review(review_id, db)
    changes = data.model_dump(exclude_unset=True)

    if not changes:
        raise HTTPException(status_code=400, detail="Nenhum campo enviado")
    if changes.get("rating", 1) is None or changes.get("times_completed", 0) is None:
        raise HTTPException(status_code=422, detail="Campo não pode ser nulo")

    for field, value in changes.items():
        setattr(review, field, value)

    db.commit()
    db.refresh(review)
    return review


@app.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
):
    review = find_review(review_id, db)
    db.delete(review)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
