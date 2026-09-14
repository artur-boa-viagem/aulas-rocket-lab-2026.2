from sqlalchemy import select

from database import SessionLocal, create_tables
from models import Game, Review, User


USERS = [
    ("Artur goodTrip", "goodtrip@example.com"),
    ("Gabriel Albuquerque", "gabriel@example.com"),
    ("Gabriel Pinheiro", "pinheiro@example.com"),
]

GAMES = [
    (
        "The Legend of Zelda: Breath of the Wild",
        "Link explora Hyrule em uma aventura de mundo aberto.",
        "https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg",
    ),
    (
        "God of War Ragnarök",
        "Kratos e Atreus enfrentam os eventos do Ragnarök.",
        "https://upload.wikimedia.org/wikipedia/en/e/ee/God_of_War_Ragnar%C3%B6k_cover.jpg",
    ),
    (
        "Minecraft",
        "Um jogo de construção, exploração e sobrevivência feito de blocos.",
        "https://upload.wikimedia.org/wikipedia/en/b/b6/Minecraft_2024_cover_art.png",
    ),
]


def seed() -> None:
    create_tables()

    with SessionLocal() as db:
        for name, email in USERS:
            user = db.scalar(select(User).where(User.email == email))
            if user is None:
                db.add(User(name=name, email=email))

        for title, synopsis, cover_url in GAMES:
            game = db.scalar(select(Game).where(Game.title == title))
            if game is None:
                db.add(Game(title=title, synopsis=synopsis, cover_url=cover_url))

        db.flush()

        first_user = db.scalar(select(User).where(User.email == USERS[0][1]))
        first_game = db.scalar(select(Game).where(Game.title == GAMES[0][0]))
        review = db.scalar(
            select(Review).where(
                Review.user_id == first_user.id,
                Review.game_id == first_game.id,
            )
        )

        if review is None:
            db.add(
                Review(
                    user_id=first_user.id,
                    game_id=first_game.id,
                    rating=5,
                    review_text="Um dos melhores jogos que já joguei!",
                    times_completed=3,
                )
            )

        db.commit()


if __name__ == "__main__":
    seed()
    print("Banco criado e dados de exemplo inseridos.")
