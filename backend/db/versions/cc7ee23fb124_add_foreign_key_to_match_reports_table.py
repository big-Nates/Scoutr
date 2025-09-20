"""add foreign key to match_reports table

Revision ID: cc7ee23fb124
Revises: 37216f6f0ea4
Create Date: 2025-08-17 20:45:41.191652

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cc7ee23fb124'
down_revision: Union[str, Sequence[str], None] = '37216f6f0ea4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("match_reports", sa.Column("creator_id", sa.Integer(), nullable=False))
    op.create_foreign_key('match_reports_users_fk', source_table="match_reports", referent_table="users"
                          , local_cols=["creator_id"], remote_cols=["_id"], ondelete="CASCADE")
    pass


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("match_reports_user_fk", table_name="match_reports")
    op.drop_column("match_reports", "creator_id")
    pass
