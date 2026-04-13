"""add sold seats to showtimes

Revision ID: 4b9c25d3c2ef
Revises: 9f4f12aa61d2
Create Date: 2026-04-12 13:20:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "4b9c25d3c2ef"
down_revision: Union[str, Sequence[str], None] = "9f4f12aa61d2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "showtimes",
        sa.Column("sold_seats", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
    )

    op.execute(
        sa.text(
            """
            UPDATE showtimes
            SET sold_seats = CASE id
                WHEN 1 THEN '["A1","A2","B4","C5"]'::json
                WHEN 2 THEN '["A5","B1","D7"]'::json
                WHEN 3 THEN '["C3","C4","E2"]'::json
                WHEN 4 THEN '["A1","F10"]'::json
                WHEN 5 THEN '["B8","C8","D8"]'::json
                WHEN 6 THEN '["A3","A4","A5"]'::json
                ELSE sold_seats
            END
            """
        )
    )

    op.alter_column("showtimes", "sold_seats", server_default=None)


def downgrade() -> None:
    op.drop_column("showtimes", "sold_seats")
