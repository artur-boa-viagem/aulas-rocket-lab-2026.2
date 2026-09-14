from database import connect, create_tables


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

    with connect() as connection:
        connection.executemany(
            "INSERT OR IGNORE INTO users (name, email) VALUES (?, ?)", USERS
        )

        for title, synopsis, cover_url in GAMES:
            exists = connection.execute(
                "SELECT id FROM games WHERE title = ?", (title,)
            ).fetchone()
            if exists is None:
                connection.execute(
                    "INSERT INTO games (title, synopsis, cover_url) VALUES (?, ?, ?)",
                    (title, synopsis, cover_url),
                )

        first_user_id = connection.execute(
            "SELECT id FROM users WHERE email = ?", (USERS[0][1],)
        ).fetchone()["id"]
        zelda_id = connection.execute(
            "SELECT id FROM games WHERE title = ?", (GAMES[0][0],)
        ).fetchone()["id"]

        connection.execute(
            """
            INSERT OR IGNORE INTO reviews
                (user_id, game_id, rating, review_text, times_completed)
            VALUES (?, ?, ?, ?, ?)
            """,
            (first_user_id, zelda_id, 5, "Um dos melhores jogos que já joguei!", 3),
        )


if __name__ == "__main__":
    seed()
    print("Banco criado e dados de exemplo inseridos.")
