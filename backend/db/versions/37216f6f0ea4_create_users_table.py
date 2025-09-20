"""create users table

Revision ID: 37216f6f0ea4
Revises: 38fb0aaf5985
Create Date: 2025-08-17 20:31:39.373726

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '37216f6f0ea4'
down_revision: Union[str, Sequence[str], None] = '38fb0aaf5985'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'users',
        sa.Column('_id', sa.Integer(), primary_key=True, index=True),
        sa.Column('email', sa.String(), unique=True, nullable=False),
        sa.Column('password', sa.String(), nullable=False),
        sa.Column('first_name', sa.String(), nullable=False),
        sa.Column('last_name_initial', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False),
        sa.Column('team_number', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text('now()'))
    )
    pass

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('users')
    pass