"""add number column to match_report table

Revision ID: 44f3e9b6c154
Revises: 942dbf9feaab
Create Date: 2025-08-16 18:28:25.648925

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '44f3e9b6c154'
down_revision: Union[str, Sequence[str], None] = '942dbf9feaab'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.rename_table('match_report', 'match_reports')
    op.add_column('match_reports', sa.Column('number', sa.Integer(),nullable=False, unique=True))
    pass


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('match_reports', 'number')
    op.rename_table('match_reports', 'match_report')
    pass
