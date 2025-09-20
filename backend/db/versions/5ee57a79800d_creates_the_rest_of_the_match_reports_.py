"""creates the rest of the match_reports table and replaces parts of the table

Revision ID: 5ee57a79800d
Revises: cc7ee23fb124
Create Date: 2025-08-17 20:57:57.107309

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5ee57a79800d'
down_revision: Union[str, Sequence[str], None] = 'cc7ee23fb124'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Add new columns to match_reports
    op.add_column('match_reports', sa.Column('is_public', sa.Boolean(), nullable=False))
    op.add_column('match_reports', sa.Column('season', sa.Integer(), nullable=False))
    op.add_column('match_reports', sa.Column('match_number', sa.Integer(), nullable=False))
    op.add_column('match_reports', sa.Column('tournament_level', sa.String(), nullable=False))
    op.add_column('match_reports', sa.Column('created_at', sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text("now()")))
    
    op.add_column('match_reports', sa.Column('auto_scoring_gamepiece_1', sa.Integer(), nullable=False))
    op.add_column('match_reports', sa.Column('auto_scoring_gamepiece_2', sa.Integer(), nullable=True))
    op.add_column('match_reports', sa.Column('can_auto_park', sa.Boolean(), nullable=False))
    op.add_column('match_reports', sa.Column('spikemark_bonus', sa.Boolean(), nullable=True))
    op.add_column('match_reports', sa.Column('bonus_1', sa.Boolean(), nullable=True, server_default=sa.text("false")))
    op.add_column('match_reports', sa.Column('bonus_2', sa.Boolean(), nullable=True, server_default=sa.text("false")))
    op.add_column('match_reports', sa.Column('bonus_3', sa.Boolean(), nullable=True, server_default=sa.text("false")))
    
    op.add_column('match_reports', sa.Column('teleop_scoring_gamepiece_1', sa.Integer(), nullable=False))
    op.add_column('match_reports', sa.Column('teleop_scoring_gamepiece_2', sa.Integer(), nullable=True))
    op.add_column('match_reports', sa.Column('can_endgame_park', sa.Boolean(), nullable=False))
    op.add_column('match_reports', sa.Column('ascent_level', sa.Integer(), nullable=False))
    
    op.add_column('match_reports', sa.Column('additional_info', sa.String(), nullable=True))
    op.drop_column('match_reports', 'number')


def downgrade():
    # Remove columns if we rollback
    op.drop_column('match_reports', 'additional_info')
    op.drop_column('match_reports', 'ascent_level')
    op.drop_column('match_reports', 'can_endgame_park')
    op.drop_column('match_reports', 'teleop_scoring_gamepiece_2')
    op.drop_column('match_reports', 'teleop_scoring_gamepiece_1')
    op.drop_column('match_reports', 'bonus_3')
    op.drop_column('match_reports', 'bonus_2')
    op.drop_column('match_reports', 'bonus_1')
    op.drop_column('match_reports', 'spikemark_bonus')
    op.drop_column('match_reports', 'can_auto_park')
    op.drop_column('match_reports', 'auto_scoring_gamepiece_2')
    op.drop_column('match_reports', 'auto_scoring_gamepiece_1')
    op.drop_column('match_reports', 'created_at')
    op.drop_column('match_reports', 'tournament_level')
    op.drop_column('match_reports', 'event_id')
    op.drop_column('match_reports', 'match_number')
    op.drop_column('match_reports', 'season')
    op.drop_column('match_reports', 'user_id')
    op.drop_column('match_reports', 'team_number')
    op.drop_column('match_reports', 'is_public')

    op.add_column('match_reports', sa.Column('number', sa.Integer(),nullable=False, unique=True))
