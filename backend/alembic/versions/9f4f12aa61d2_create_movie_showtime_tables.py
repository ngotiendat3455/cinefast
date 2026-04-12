"""create movie showtime tables

Revision ID: 9f4f12aa61d2
Revises: f5a45027ca80
Create Date: 2026-04-12 10:30:00.000000

"""

from datetime import date, datetime, timezone
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9f4f12aa61d2"
down_revision: Union[str, Sequence[str], None] = "f5a45027ca80"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "cinemas",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("location", sa.String(length=120), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_cinemas_location"), "cinemas", ["location"], unique=False)

    op.create_table(
        "movies",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("slug", sa.String(length=180), nullable=False),
        sa.Column("genre", sa.String(length=120), nullable=False),
        sa.Column("rating", sa.String(length=20), nullable=False),
        sa.Column("duration_min", sa.Integer(), nullable=False),
        sa.Column("release_date", sa.Date(), nullable=False),
        sa.Column("poster_url", sa.Text(), nullable=False),
        sa.Column("backdrop_url", sa.Text(), nullable=False),
        sa.Column("trailer_url", sa.Text(), nullable=True),
        sa.Column("synopsis", sa.Text(), nullable=False),
        sa.Column("cast", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("is_featured", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_movies_slug"), "movies", ["slug"], unique=True)
    op.create_index(op.f("ix_movies_status"), "movies", ["status"], unique=False)
    op.create_index(op.f("ix_movies_title"), "movies", ["title"], unique=False)

    op.create_table(
        "rooms",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("cinema_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=80), nullable=False),
        sa.Column("seat_map", sa.JSON(), nullable=False),
        sa.ForeignKeyConstraint(["cinema_id"], ["cinemas.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_rooms_cinema_id"), "rooms", ["cinema_id"], unique=False)

    op.create_table(
        "showtimes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("movie_id", sa.Integer(), nullable=False),
        sa.Column("room_id", sa.Integer(), nullable=False),
        sa.Column("format", sa.String(length=20), nullable=False),
        sa.Column("language", sa.String(length=40), nullable=False),
        sa.Column("start_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("price", sa.Numeric(10, 2), nullable=False),
        sa.ForeignKeyConstraint(["movie_id"], ["movies.id"]),
        sa.ForeignKeyConstraint(["room_id"], ["rooms.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_showtimes_format"), "showtimes", ["format"], unique=False)
    op.create_index(op.f("ix_showtimes_movie_id"), "showtimes", ["movie_id"], unique=False)
    op.create_index(op.f("ix_showtimes_room_id"), "showtimes", ["room_id"], unique=False)
    op.create_index(op.f("ix_showtimes_start_time"), "showtimes", ["start_time"], unique=False)

    cinema_table = sa.table(
        "cinemas",
        sa.column("id", sa.Integer()),
        sa.column("name", sa.String()),
        sa.column("location", sa.String()),
    )
    movie_table = sa.table(
        "movies",
        sa.column("id", sa.Integer()),
        sa.column("title", sa.String()),
        sa.column("slug", sa.String()),
        sa.column("genre", sa.String()),
        sa.column("rating", sa.String()),
        sa.column("duration_min", sa.Integer()),
        sa.column("release_date", sa.Date()),
        sa.column("poster_url", sa.Text()),
        sa.column("backdrop_url", sa.Text()),
        sa.column("trailer_url", sa.Text()),
        sa.column("synopsis", sa.Text()),
        sa.column("cast", sa.Text()),
        sa.column("status", sa.String()),
        sa.column("is_featured", sa.Boolean()),
    )
    room_table = sa.table(
        "rooms",
        sa.column("id", sa.Integer()),
        sa.column("cinema_id", sa.Integer()),
        sa.column("name", sa.String()),
        sa.column("seat_map", sa.JSON()),
    )
    showtime_table = sa.table(
        "showtimes",
        sa.column("id", sa.Integer()),
        sa.column("movie_id", sa.Integer()),
        sa.column("room_id", sa.Integer()),
        sa.column("format", sa.String()),
        sa.column("language", sa.String()),
        sa.column("start_time", sa.DateTime(timezone=True)),
        sa.column("end_time", sa.DateTime(timezone=True)),
        sa.column("price", sa.Numeric(10, 2)),
    )

    op.bulk_insert(
        cinema_table,
        [
            {"id": 1, "name": "CineFast Central", "location": "Downtown"},
            {"id": 2, "name": "CineFast Riverside", "location": "Riverside"},
            {"id": 3, "name": "CineFast Skyline", "location": "Midtown"},
        ],
    )

    op.bulk_insert(
        movie_table,
        [
            {
                "id": 1,
                "title": "Neon Run",
                "slug": "neon-run",
                "genre": "Sci-Fi, Action",
                "rating": "PG-13",
                "duration_min": 128,
                "release_date": date(2026, 4, 2),
                "poster_url": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
                "backdrop_url": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=80",
                "trailer_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                "synopsis": "A courier with a stolen quantum drive races across a sleepless megacity while rival syndicates collapse the power grid around her.",
                "cast": "Mina Hart, Theo Vale, Kira Sol",
                "status": "NOW_SHOWING",
                "is_featured": True,
            },
            {
                "id": 2,
                "title": "Harbor of Stars",
                "slug": "harbor-of-stars",
                "genre": "Drama, Romance",
                "rating": "PG",
                "duration_min": 109,
                "release_date": date(2026, 4, 5),
                "poster_url": "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=900&q=80",
                "backdrop_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
                "trailer_url": "https://www.youtube.com/embed/ScMzIvxBSi4",
                "synopsis": "Two estranged musicians reunite in a storm-battered coastal town and get one last chance to finish the album that once defined them.",
                "cast": "Elena Park, Jonas Reed, Clara Wynn",
                "status": "NOW_SHOWING",
                "is_featured": True,
            },
            {
                "id": 3,
                "title": "Cloudline 2049",
                "slug": "cloudline-2049",
                "genre": "Thriller, Mystery",
                "rating": "R",
                "duration_min": 136,
                "release_date": date(2026, 4, 18),
                "poster_url": "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=900&q=80",
                "backdrop_url": "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1400&q=80",
                "trailer_url": "https://www.youtube.com/embed/jNQXAC9IVRw",
                "synopsis": "An aviation investigator discovers a pattern hidden inside a decade of black box recordings, pointing to a sabotage network above the clouds.",
                "cast": "Rhea Moss, Liam Cross, Omar Vale",
                "status": "COMING_SOON",
                "is_featured": False,
            },
            {
                "id": 4,
                "title": "The Last Matinee",
                "slug": "the-last-matinee",
                "genre": "Horror, Suspense",
                "rating": "R",
                "duration_min": 97,
                "release_date": date(2026, 4, 22),
                "poster_url": "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=80",
                "backdrop_url": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1400&q=80",
                "trailer_url": "https://www.youtube.com/embed/ysz5S6PUM-U",
                "synopsis": "A projectionist trapped in a single-screen cinema realizes the film stock itself is replaying the final night of everyone inside.",
                "cast": "Sora Lane, Nico Flint, Mara Dev",
                "status": "COMING_SOON",
                "is_featured": False,
            },
        ],
    )

    seat_map = {
        "rows": ["A", "B", "C", "D", "E", "F"],
        "seats_per_row": 10,
    }

    op.bulk_insert(
        room_table,
        [
            {"id": 1, "cinema_id": 1, "name": "Room 1", "seat_map": seat_map},
            {"id": 2, "cinema_id": 1, "name": "IMAX", "seat_map": seat_map},
            {"id": 3, "cinema_id": 2, "name": "Room 3", "seat_map": seat_map},
            {"id": 4, "cinema_id": 3, "name": "Sky Hall", "seat_map": seat_map},
        ],
    )

    op.bulk_insert(
        showtime_table,
        [
            {
                "id": 1,
                "movie_id": 1,
                "room_id": 2,
                "format": "IMAX",
                "language": "English",
                "start_time": datetime(2026, 4, 12, 10, 30, tzinfo=timezone.utc),
                "end_time": datetime(2026, 4, 12, 12, 38, tzinfo=timezone.utc),
                "price": 11.50,
            },
            {
                "id": 2,
                "movie_id": 1,
                "room_id": 1,
                "format": "2D",
                "language": "English",
                "start_time": datetime(2026, 4, 12, 14, 0, tzinfo=timezone.utc),
                "end_time": datetime(2026, 4, 12, 16, 8, tzinfo=timezone.utc),
                "price": 8.50,
            },
            {
                "id": 3,
                "movie_id": 1,
                "room_id": 3,
                "format": "3D",
                "language": "English",
                "start_time": datetime(2026, 4, 13, 17, 30, tzinfo=timezone.utc),
                "end_time": datetime(2026, 4, 13, 19, 38, tzinfo=timezone.utc),
                "price": 9.75,
            },
            {
                "id": 4,
                "movie_id": 2,
                "room_id": 4,
                "format": "2D",
                "language": "English",
                "start_time": datetime(2026, 4, 12, 9, 15, tzinfo=timezone.utc),
                "end_time": datetime(2026, 4, 12, 11, 4, tzinfo=timezone.utc),
                "price": 7.90,
            },
            {
                "id": 5,
                "movie_id": 2,
                "room_id": 3,
                "format": "2D",
                "language": "English",
                "start_time": datetime(2026, 4, 13, 13, 0, tzinfo=timezone.utc),
                "end_time": datetime(2026, 4, 13, 14, 49, tzinfo=timezone.utc),
                "price": 7.90,
            },
            {
                "id": 6,
                "movie_id": 2,
                "room_id": 1,
                "format": "3D",
                "language": "English",
                "start_time": datetime(2026, 4, 14, 19, 0, tzinfo=timezone.utc),
                "end_time": datetime(2026, 4, 14, 20, 49, tzinfo=timezone.utc),
                "price": 9.20,
            },
        ],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_showtimes_start_time"), table_name="showtimes")
    op.drop_index(op.f("ix_showtimes_room_id"), table_name="showtimes")
    op.drop_index(op.f("ix_showtimes_movie_id"), table_name="showtimes")
    op.drop_index(op.f("ix_showtimes_format"), table_name="showtimes")
    op.drop_table("showtimes")

    op.drop_index(op.f("ix_rooms_cinema_id"), table_name="rooms")
    op.drop_table("rooms")

    op.drop_index(op.f("ix_movies_title"), table_name="movies")
    op.drop_index(op.f("ix_movies_status"), table_name="movies")
    op.drop_index(op.f("ix_movies_slug"), table_name="movies")
    op.drop_table("movies")

    op.drop_index(op.f("ix_cinemas_location"), table_name="cinemas")
    op.drop_table("cinemas")
