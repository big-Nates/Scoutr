"""drop title column

Revision ID: 38fb0aaf5985
Revises: 44f3e9b6c154
Create Date: 2025-08-17 20:29:14.242472

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '38fb0aaf5985'
down_revision: Union[str, Sequence[str], None] = '44f3e9b6c154'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_column("match_reports", "title")
    pass


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column("match_reports", "title")
    pass
